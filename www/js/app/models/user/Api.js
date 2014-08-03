/**
 * @module Application
 */
define([
    "framework/GelatoModel"
], function(GelatoModel) {
    return GelatoModel.extend({
        /**
         * @class UserApi
         * @extend GelatoModel
         * @constructor
         */
        initialize: function() {
            this.on("change", this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            "access_token": undefined,
            "client_id": "mcfarljwapiclient",
            "client_secret": "e3872517fed90a820e441531548b8c",
            "expires_in": undefined,
            "refresh_token": undefined,
            "token_type": undefined,
            "root": "https://beta.skritter",
            "tld": location.host.indexOf(".cn") === -1 ? ".com" : ".cn",
            "user_id": "guest",
            "version": 0
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(app.user.id + "-api", JSON.stringify(this.toJSON()));
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            $.ajax({
                url: this.getBaseURL() + "oauth2/token",
                beforeSend: _.bind(this.beforeSend, this),
                type: "POST",
                data: {
                    suppress_response_codes: true,
                    grant_type: "password",
                    client_id: this.get("client_id"),
                    username: username,
                    password: password
                }
            }).done(function(data) {
                callback(data, data.statusCode);
            }).fail(function(error) {
                console.log(error);
                callback(error, error.status);
            });
        },
        /**
         * @method beforeSend
         * @param {XHR} xhr
         */
        beforeSend: function(xhr) {
            xhr.setRequestHeader('AUTHORIZATION', this.getCredentials());
        },
        /**
         * @method getBaseURL
         * @returns {String}
         */
        getBaseURL: function() {
            return this.get("root") + this.get("tld") + "/api/v" + this.get("version") + "/";
        },
        /**
         * @method getCredentials
         * @returns {String}
         */
        getCredentials: function() {
            return "basic " + btoa(this.get("client_id") + ":" + this.get("client_secret"));
        },
        /**
         * @method getUserSettings
         * @param {String} userId
         * @param {Function} callback
         */
        getUserSettings: function(userId, callback) {
            $.ajax({
                url: this.getBaseURL() + "users/" + userId,
                beforeSend: _.bind(this.beforeSend, this),
                type: "GET",
                data: {
                    bearer_token: this.get('access_token'),
                    detailed: true
                }
            }).done(function(data) {
                callback(data.User, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method refreshToken
         * @param {Function} callback
         */
        refreshToken: function(callback) {
            $.ajax({
                url: this.getBaseURL() + "oauth2/token",
                beforeSend: _.bind(this.beforeSend, this),
                type: "POST",
                data: {
                    grant_type: "refresh_token",
                    client_id: this.get("client_id"),
                    refresh_token: this.get("refresh_token")
                }
            }).done(function(data) {
                callback(data, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        }
    });
});