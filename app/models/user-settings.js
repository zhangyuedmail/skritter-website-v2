var GelatoModel = require('gelato/modules/model');

/**
 * @class UserSettings
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.on('change', this.save);
    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        allChineseParts: ['defn', 'rdng', 'rune', 'tone'],
        allJapaneseParts: ['defn', 'rdng', 'rune'],
        filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
        filterJapaneseParts: ['defn', 'rdng', 'rune'],
        gradingColors: {1: '#e74c3c', 2: '#ebbd3e', 3: '#87a64b', 4: '#4d88e3'},
        goals: {ja: {items: 20}, zh: {items: 20}}
    },
    /**
     * @method cache
     * @returns {UserCredentials}
     */
    cache: function() {
        app.user.setLocalData('settings', this.toJSON());
        return this;
    },
    /**
     * @method fetch
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetch: function(callbackSuccess, callbackError) {
        var self = this;
        app.api.fetchUsers(app.user.id, null, function(data) {
            self.set(data, {merge: true});
            if (typeof callbackSuccess === 'function') {
                callbackSuccess();
            }
        }, function(error) {
            if (typeof callbackError === 'function') {
                callbackError(error);
            }
        });
    },
    /**
     * @method getGoal
     * @returns {Object}
     */
    getGoal: function() {
        var goal = this.get('goals')[app.get('language')];
        var type = Object.keys(goal)[0];
        return {type: type, value: goal[type]};
    },
    /**
     * @method load
     * @returns {UserCredentials}
     */
    load: function() {
        var settings = app.user.getLocalData('settings');
        if (settings) {
            this.set(settings, {silent: true});
            if (app.get('language') === 'undefined') {
                app.set('language', this.get('targetLang'));
            }
        }
        return this;
    },
    /**
     * @method save
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    save: function(callbackSuccess, callbackError) {
        var self = this;
        app.api.putUser(this.toJSON(), function(result) {
            self.set(result, {merge: true, silent: true});
            self.cache();
            if (typeof callbackSuccess === 'function') {
                callbackSuccess(self);
            }
        }, function(error) {
            self.cache();
            if (typeof callbackError === 'function') {
                callbackError(error);
            }
        });
    },
    /**
     * @method setGoal
     * @param {String} type
     * @param {String} value
     * @returns {UserSettings}
     */
    setGoal: function(type, value) {
        var goal = {};
        var goals = this.get('goals');
        goal[type] = parseInt(value, 10);
        goals[app.get('language')] = goal;
        this.set('goals', goals);
        this.trigger('change:goals', this);
        this.save();
        return this;
    }
});