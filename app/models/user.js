var GelatoModel = require('gelato/model');
var HistoryItems = require('collections/history-items');
var UserAuth = require('models/user-auth');
var UserData = require('models/user-data');
var UserSettings = require('models/user-settings');

/**
 * @class User
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.auth = new UserAuth();
        this.data = new UserData();
        this.history = new HistoryItems();
        this.settings = new UserSettings();
    },
    /**
     * @property defaults
     * @type Object
     */
    defaults: {
        id: 'guest'
    },
    /**
     * @method getLocalData
     * @param {String} key
     * @returns {Number|Object|String}
     */
    getLocalData: function(key) {
        return JSON.parse(localStorage.getItem(this.id + '-' + key));
    },
    /**
     * @method isLoggedIn
     * @returns {Boolean}
     */
    isLoggedIn: function() {
        return this.id !== 'guest';
    },
    /**
     * @method load
     */
    load: function() {
        var user = app.getSetting('user');
        if (user) {
            Raygun.setUser(user.id, false);
            this.set('id', user);
            this.auth.load();
            this.settings.load();
            this.settings.fetch();

        } else {
            Raygun.setUser('guest', true);
        }
    },
    /**
     * @method login
     * @param {String} username
     * @param {String} password
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    login: function(username, password, callbackSuccess, callbackError) {
        this.auth.authenticateUser(username, password, callbackSuccess, callbackError);
    },
    /**
     * @method logout
     */
    logout: function() {
        this.removeLocalData('auth');
        this.removeLocalData('settings');
        app.removeSetting('user');
        app.reload();
    },
    /**
     * @method removeLocalData
     * @param {String} key
     */
    removeLocalData: function(key) {
        localStorage.removeItem(this.id + '-' + key);
    },
    /**
     * @method setLocalData
     * @param {String} key
     * @param {Number|Object|String} data
     */
    setLocalData: function(key, data) {
        localStorage.setItem(this.id + '-' + key, JSON.stringify(data));
    }
});
