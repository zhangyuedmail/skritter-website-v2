var SkritterModel = require('base/skritter-model');
var Session = require('models/session');

/**
 * @class User
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.session.user = this;
    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        addItemOffset: 0,
        allChineseParts: ['defn', 'rdng', 'rune', 'tone'],
        allJapaneseParts: ['defn', 'rdng', 'rune'],
        filteredChineseParts: ['defn', 'rdng', 'rune', 'tone'],
        filteredJapaneseParts: ['defn', 'rdng', 'rune'],
        hideDefinition: false,
        gradingColors: {1: '#e74c3c', 2: '#ebbd3e', 3: '#87a64b', 4: '#4d88e3'},
        goals: {ja: {items: 20}, zh: {items: 20}},
        teachingMode: true
    },
    /**
     * @method parse
     * @param {Object} response
     * @returns Array
     */
    parse: function(response) {
        return response.User;
    },
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
     * @method cache
     */
    cache: function() {
        app.setLocalStorage(this.id + '-user', this.toJSON());
    },
    /**
     * @method getAllStudyParts
     * @returns {Array}
     */
    getAllStudyParts: function() {
        return app.isChinese() ? this.get('allChineseParts') : this.get('allJapaneseParts');
    },
    /**
     * @method getAllStudyStyles
     * @returns {Array}
     */
    getAllStudyStyles: function() {
        return app.isChinese() ? ['both', 'simp', 'trad'] : ['none'];
    },
    /**
     * @method getFilterParts
     * @returns {Array}
     */
    getFilteredParts: function() {
        var filteredParts = app.isChinese() ? this.get('filteredChineseParts') : this.get('filteredJapaneseParts');
        return _.intersection(this.getStudyParts(), filteredParts);
    },
    /**
     * @method getFilteredStyles
     * @returns {Array}
     */
    getFilteredStyles: function() {
        var styles = ['both'];
        if (app.isChinese()) {
            if (this.get('reviewSimplified')) {
                styles.push('simp');
            }
            if (this.get('reviewTraditional')) {
                styles.push('trad');
            }
        }
        return styles;
    },
    /**
     * @method getStudyParts
     * @returns {Array}
     */
    getStudyParts: function() {
        return app.isChinese() ? this.get('chineseStudyParts') : this.get('japaneseStudyParts');
    },
    /**
     * @method getRaygunTags
     * @returns {Array}
     */
    getRaygunTags: function() {
        var tags = [];
        if (app.isChinese()) {
            tags.push('chinese');
            if (this.get('reviewSimplified')) {
                tags.push('simplified');
            }
            if (this.get('reviewTraditional')) {
                tags.push('traditional');
            }
        } else if (app.isJapanese()) {
            tags.push('japanese');
        }
        return tags;
    },
    /**
     * @method isAddingPart
     * @param {String} part
     * @returns {Boolean}
     */
    isAddingPart: function(part) {
        return _.includes(this.getStudyParts(), part);
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
        return this.session.has('user_id');
    },
    /**
     * @method isReviewingPart
     * @param {String} part
     * @returns {Boolean}
     */
    isReviewingPart: function(part) {
        return _.includes(this.getFilteredParts(), part);
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
                app.removeSetting('session');
                app.setSetting('user', this.id);
                callbackSuccess(user);
            }
        }, this));
    },
    /**
     * @method logout
     */
    logout: function() {
        app.db.delete()
            .then(function() {
                app.removeLocalStorage(this.id + '-session');
                app.removeLocalStorage(this.id + '-user');
                app.removeSetting('user');
                app.reload();
            })
            .catch(function(error) {
                console.error(error);
                app.reload();
            });
    }
});
