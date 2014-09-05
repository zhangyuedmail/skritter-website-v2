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
         * @method getBatch
         * @param {String} batchId
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         * @param {Function} [callbackResult]
         */
        checkBatch: function(batchId, callbackComplete, callbackError, callbackResult) {
            var self = this;
            (function wait() {
                $.ajax({
                    url: self.getBaseUrl() + 'batch/' + batchId + '/status',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        detailed: true
                    }
                }).done(function(data) {
                    if (data.Batch && data.statusCode === 200) {
                        data.Batch.responseSize = app.fn.addAllObjectAttributes(data.Batch.Requests, 'responseSize');
                        if (data.Batch.runningRequests > 0) {
                            callbackResult(data.Batch);
                            setTimeout(wait, 5000);
                        } else {
                            if (typeof callbackResult === 'function') {
                                callbackResult(data.Batch);
                            }
                            callbackComplete(_.pluck(data.Batch.Requests, 'id'));
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
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
         * @method getBatch
         * @param {String} batchId
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         * @param {Function} callbackResult
         */
        getBatch: function(batchId, callbackComplete, callbackError, callbackResult) {
            var self = this;
            var downloadedRequests = 0;
            async.waterfall([
                function(callback) {
                    self.checkBatch(batchId, function(requestIds) {
                        callback(null, requestIds);
                    }, function(error) {
                        callback(error);
                    });
                },
                function(requestIds, callback) {
                    (function download() {
                        $.ajax({
                            url: self.getBaseUrl() + 'batch/' + batchId,
                            beforeSend: self.beforeSend,
                            context: self,
                            type: 'GET',
                            data: {
                                bearer_token: self.getToken(),
                                request_ids: requestIds.splice(0, 49).join(',')
                            }
                        }).done(function(data) {
                            var result = {};
                            result.responseSize = 0;
                            if (data.statusCode === 200) {
                                for (var i = 0, length = data.Batch.Requests.length; i < length; i++) {
                                    if (typeof data.Batch.Requests[i].response === 'object') {
                                        result = app.fn.mergeObjectArrays(result, data.Batch.Requests[i].response);
                                        result.responseSize += data.Batch.Requests[i].responseSize;
                                    }
                                    downloadedRequests++;
                                }
                                delete result.cursor;
                                delete result.statusCode;
                                result.downloadedRequests = downloadedRequests;
                                result.totalRequests = data.Batch.totalRequests;
                                callbackResult(result);
                                if (requestIds.length > 0) {
                                    setTimeout(download, 500);
                                } else {
                                    callback();
                                }
                            } else {
                                callback(data);
                            }
                        }).fail(function(error) {
                            callback(error);
                        });
                    })();
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackComplete();
                }
            });
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
                url: this.getBaseUrl() + 'subscriptions/' + userId,
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
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
            var self = this;
            var users = [];
            options = options ? option : {};
            userIds = Array.isArray(userIds) ? userIds : [userIds];
            (function next() {
                $.ajax({
                    url: self.getBaseUrl() + 'users',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        ids: userIds.splice(0, 9).join(','),
                        fields: options.fields
                    }
                }).done(function(data) {
                    users = users.concat(data.Users);
                    if (userIds.length > 0) {
                        setTimeout(next, 500);
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
            })();
        },
        /**
         * @method requestBatch
         * @param {Array|Object} requests
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        requestBatch: function(requests, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'batch?bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: JSON.stringify(Array.isArray(requests) ? requests : [requests])
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.Batch);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        }
    });

    return Api;
});