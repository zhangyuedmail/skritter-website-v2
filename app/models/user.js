var GelatoModel = require('gelato/modules/model');
var HistoryItems = require('collections/history-items');
var UserCredentials = require('models/user-credentials');
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
        this.credentials = new UserCredentials();
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
            this.set('id', user);
            this.credentials.load();
            this.settings.load();
            this.settings.fetch();
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
        var self = this;
        app.api.authenticateUser(username, password, function(result) {
            self.set('id', result.user_id);
            self.credentials.set(result);
            self.credentials.set('created', moment().unix());
            app.setSetting('user', self.id);
            callbackSuccess(result);
        }, function(error) {
            callbackError(error);
        });
    },
    /**
     * @method logout
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    logout: function(callbackSuccess, callbackError) {
        app.removeSetting('user');
        app.reload();
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
