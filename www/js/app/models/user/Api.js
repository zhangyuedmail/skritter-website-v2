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
            "batchId": undefined,
            "batchRequestIds": [],
            "client_id": "mcfarljwapiclient",
            "client_secret": "e3872517fed90a820e441531548b8c",
            "expires_in": undefined,
            "refresh_token": undefined,
            "token_type": undefined,
            "root": "https://beta.skritter",
            "statusCode": undefined,
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
                url: this.getBaseUrl() + "oauth2/token",
                beforeSend: this.beforeSend,
                context: this,
                type: "POST",
                data: {
                    grant_type: "password",
                    client_id: this.get("client_id"),
                    username: username,
                    password: password
                }
            }).done(function(data) {
                this.set(data);
                callback(data, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method beforeSend
         * @param {jqXHR} xhr
         */
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", this.getCredentials());
        },
        /**
         * @method checkBatch
         * @param {String} batchId
         * @param {Function} callback
         * @param {Boolean} options
         */
        checkBatch: function(batchId, callback, options) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + "batch/" + batchId + "/status",
                beforeSend: this.beforeSend,
                context: this,
                type: "GET",
                data: {
                    bearer_token: this.get("access_token"),
                    detailed: options.detailed,
                    request_ids: options.request_ids
                }
            }).done(function(data) {
                callback(data.Batch, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method getBaseUrl
         * @returns {String}
         */
        getBaseUrl: function() {
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
         * @method getUsers
         * @param {Array|String} ids
         * @param {Function} callback
         * @param {Object} options
         */
        getUsers: function(userIds, callback, options) {
            var users = [];
            options = options ? option : {};
            userIds = Array.isArray(userIds) ? userIds : [userIds];
            (function next() {
                $.ajax({
                    url: this.getBaseUrl() + "users",
                    beforeSend: this.beforeSend,
                    context: this,
                    type: "GET",
                    data: {
                        bearer_token: this.get("access_token"),
                        ids: userIds.splice(0, 9).join(","),
                        fields: options.fields
                    }
                }).done(function(data) {
                    users = users.concat(data.Users);
                    if (userIds.length > 0) {
                        next.call(this);
                    } else {
                        callback(users, data.statusCode);
                    }
                }).fail(function(error) {
                    callback(error, error.status);
                });
            }).call(this);
        },
        /**
         * @method getUserSettings
         * @param {Function} callback
         * @param {Object} options
         */
        getUserSettings: function(callback, options) {
            options = options ? option : {};
            $.ajax({
                url: this.getBaseUrl() + "users/" + this.get("user_id"),
                beforeSend: this.beforeSend,
                context: this,
                type: "GET",
                data: {
                    bearer_token: this.get("access_token"),
                    fields: options.fields
                }
            }).done(function(data) {
                callback(data.User, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method getUserSubscription
         * @param {String} userId
         * @param {Function} callback
         * @param {Object} options
         */
        getUserSubscription: function(userId, callback, options) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + "subscriptions/" + userId,
                beforeSend: this.beforeSend,
                context: this,
                type: "GET",
                data: {
                    bearer_token: this.get("access_token"),
                    fields: options.fields
                }
            }).done(function(data) {
                callback(data.Subscription, data.statusCode);
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
                url: this.getBaseUrl() + "oauth2/token",
                beforeSend: this.beforeSend,
                context: this,
                type: "POST",
                data: {
                    grant_type: "refresh_token",
                    client_id: this.get("client_id"),
                    refresh_token: this.get("refresh_token")
                }
            }).done(function(data) {
                this.set(data);
                callback(data, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method requestBatch
         * @param {Array|Object} requests
         * @param {Function} callback
         */
        requestBatch: function(requests, callback) {
            requests = Array.isArray(requests) ? requests : [requests];
            $.ajax({
                url: this.getBaseUrl() + "batch?bearer_token=" + this.get("access_token"),
                beforeSend: this.beforeSend,
                context: this,
                type: "POST",
                data: JSON.stringify(requests)
            }).done(function(data) {
                this.set("batchId", data.Batch.id);
            }).fail(function(error) {
                callback(error, error.status);
            });
        }
    });
});