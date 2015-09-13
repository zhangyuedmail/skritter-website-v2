var SkritterModel = require('base/skritter-model');
var Session = require('models/session');

/**
 * @class User
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property session
     * @type {Session}
     */
    session: new Session(),
    /**
     * @property urlRoot
     * @type {String}
     */
    urlRoot: 'users',
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        allChineseParts: ['defn', 'rdng', 'rune', 'tone'],
        allJapaneseParts: ['defn', 'rdng', 'rune'],
        gradingColors: {1: '#e74c3c', 2: '#ebbd3e', 3: '#87a64b', 4: '#4d88e3'},
        goals: {ja: {items: 20}, zh: {items: 20}}
    },
    /**
     * @method cache
     */
    cache: function() {
        app.setLocalStorage(this.id + '-user', this.toJSON());
    },
    /**
     * @method getAllParts
     * @returns {Array}
     */
    getAllParts: function() {
        return app.isChinese() ? this.get('allChineseParts') : this.get('allJapaneseParts');
    },
    /**
     * @method getStudyParts
     * @returns {Object}
     */
    getStudyParts: function() {
        return app.isChinese() ? this.get('chineseStudyParts') : this.get('japaneseStudyParts');
    },
    /**
     * @method hasStudyPart
     * @param {String} part
     * @returns {Boolean}
     */
    hasStudyPart: function(part) {
        return this.getStudyParts().indexOf(part) > -1;
    },
    /**
     * @method isAudioEnabled
     * @returns {Boolean}
     */
    isAudioEnabled: function() {
        return this.get('volume') > 0;
    },
    /**
     * @method isLoggedIn
     * @returns {Boolean}
     */
    isLoggedIn: function() {
        return !this.session.isExpired();
    },
    /**
     * @method login
     * @param {String} username
     * @param {String} password
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    login: function(username, password, callbackSuccess, callbackError) {
        async.waterfall([
            _.bind(function(callback) {
                this.session.authenticate('password', username, password,
                    function(result) {
                        callback(null, result);
                    }, function(error) {
                        callback(error);
                    });
            }, this),
            _.bind(function(result, callback) {
                this.set('id', result.id);
                this.fetch({
                    error: function(error) {
                        callback(error);
                    },
                    success: function(user) {
                        callback(null, user);
                    }
                })
            }, this)
        ], _.bind(function(error, user) {
            if (error) {
                callbackError(error);
            } else {
                this.cache();
                this.session.cache();
                app.setSetting('user', this.id);
                callbackSuccess(user);
            }
        }, this));
    },
    /**
     * @method logout
     */
    logout: function() {
        app.removeLocalStorage(this.id + '-session');
        app.removeLocalStorage(this.id + '-user');
        app.removeSetting('user');
        app.reload();
    },
    /**
     * @method parse
     * @param {Object} response
     * @returns Array
     */
    parse: function(response) {
        return response.User;
    }
});
