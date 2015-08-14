var GelatoModel = require('gelato/model');

/**
 * @class UserAuth
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.on('change', this.cache);
    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        created: 0,
        expires_in: 0,
        user_id: 'guest'
    },
    /**
     * @method authenticateGuest
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    authenticateGuest: function(callbackSuccess, callbackError) {
        $.ajax({
            url: app.api.getUrl() + 'oauth2/token',
            headers: app.api.getLoginHeaders(),
            context: this,
            type: 'POST',
            data: {
                client_id: app.api.getClientId(),
                grant_type: 'client_credentials'
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method login
     * @param {String} username
     * @param {String} password
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    authenticateUser: function(username, password, callbackSuccess, callbackError) {
        $.ajax({
            url: app.api.getUrl() + 'oauth2/token',
            headers: app.api.getLoginHeaders(),
            context: this,
            type: 'POST',
            data: {
                client_id: app.api.getClientId(),
                grant_type: 'password',
                password: password,
                username: username
            }
        }).done(function(result) {
            if (result.statusCode === 200) {
                app.user.set('id', result.user_id);
                result.created = moment().unix();
                this.set(result);
                app.setSetting('user', app.user.id);
                callbackSuccess(result);
            } else {
                callbackError(result);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method cache
     * @returns {UserAuth}
     */
    cache: function() {
        app.user.setLocalData('auth', this.toJSON());
        return this;
    },
    /**
     * @method getExpires
     * @returns {Number}
     */
    getExpires: function() {
        return this.get('created') + this.get('expires_in');
    },
    /**
     * @method isExpired
     * @returns {Boolean}
     */
    isExpired: function() {
        return this.getExpires() < moment().unix();
    },
    /**
     * @method load
     * @returns {UserAuth}
     */
    load: function() {
        var credentials = app.user.getLocalData('auth');
        if (credentials) {
            this.set(credentials, {silent: true});
        }
        return this;
    },
    /**
     * @method refresh
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    refresh: function(callbackSuccess, callbackError) {
        $.ajax({
            url: app.api.getUrl() + 'oauth2/token',
            headers: app.api.getLoginHeaders(),
            context: this,
            type: 'POST',
            data: {
                client_id: app.api.getClientId(),
                grant_type: 'refresh_token',
                refresh_token: token
            }
        }).done(function(result) {
            if (result.statusCode === 200) {
                result.created = moment().unix();
                this.set(result, {merge: true});
                callbackSuccess(result);
            } else {
                callbackError(result);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    }
});
