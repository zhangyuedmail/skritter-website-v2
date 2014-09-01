/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class Api
     * @extend BaseModel
     */
    var Api = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            clientId: 'mcfarljwapiclient',
            clientSecret: 'e3872517fed90a820e441531548b8c',
            root: 'https://beta.skritter',
            tld: location.host.indexOf('.cn') === -1 ? '.com' : '.cn',
            version: 0
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateGuest: function(callback) {
            $.ajax({
                url: this.getBaseUrl() + 'oauth2/token',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    grant_type: 'client_credentials',
                    client_id: this.get('clientId')
                }
            }).done(function(data) {
                callback(data, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            $.ajax({
                url: this.getBaseUrl() + 'oauth2/token',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    grant_type: 'password',
                    client_id: this.get('clientId'),
                    username: username,
                    password: password
                }
            }).done(function(data) {
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
            xhr.setRequestHeader('Authorization', this.getCredentials());
        },
        /**
         * @method createUser
         * @param {String} token
         * @param {Function} callback
         * @param {Object} [options]
         */
        createUser: function(token, callback, options) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + 'users',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    bearer_token: token,
                    fields: options.fields,
                    lang: options.lang
                }
            }).done(function(data) {
                callback(data.User, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method getBaseUrl
         * @returns {String}
         */
        getBaseUrl: function() {
            return this.get('root') + this.get('tld') + '/api/v' + this.get('version') + '/';
        },
        /**
         * @method getCredentials
         * @returns {String}
         */
        getCredentials: function() {
            return 'basic ' + btoa(this.get('clientId') + ':' + this.get('clientSecret'));
        },
        /**
         * @method getUserSubscription
         * @param {String} userId
         * @param {Function} callback
         * @param {Object} [options]
         */
        getSubscription: function(userId, callback, options) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + "subscriptions/" + userId,
                beforeSend: this.beforeSend,
                context: this,
                type: "GET",
                data: {
                    bearer_token: this.getToken(),
                    fields: options.fields
                }
            }).done(function(data) {
                callback(data.Subscription, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method getToken
         */
        getToken: function() {
            return app.user ? app.user.data.get('access_token') : undefined;
        },
        /**
         * @method getUsers
         * @param {Array|String} userIds
         * @param {Function} callback
         * @param {Object} [options]
         */
        getUsers: function(userIds, callback, options) {
            var users = [];
            options = options ? option : {};
            userIds = Array.isArray(userIds) ? userIds : [userIds];
            (function next() {
                $.ajax({
                    url: this.getBaseUrl() + 'users',
                    beforeSend: this.beforeSend,
                    context: this,
                    type: 'GET',
                    data: {
                        bearer_token: this.getToken(),
                        ids: userIds.splice(0, 9).join(','),
                        fields: options.fields
                    }
                }).done(function(data) {
                    users = users.concat(data.Users);
                    if (userIds.length > 0) {
                        next.call(this);
                    } else {
                        if (users.length === 1) {
                            callback(users[0], data.statusCode);
                        } else {
                            callback(users, data.statusCode);
                        }
                    }
                }).fail(function(error) {
                    callback(error, error.status);
                });
            }).call(this);
        }
    });

    return Api;
});