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
            "clientId": "mcfarljwapiclient",
            "clientSecret": "e3872517fed90a820e441531548b8c",
            "root": "https://beta.skritter",
            "tld": location.host.indexOf(".cn") === -1 ? ".com" : ".cn",
            "version": 0
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
                    client_id: this.get("clientId"),
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
            xhr.setRequestHeader("Authorization", this.getCredentials());
        },
        /**
         * @method getBaseUrl
         * @returns {String}
         */
        getBaseUrl: function() {
            return this.get("root") + this.get("tld") + "/api/v" + this.get("version") + "/";
        },

        /**
         * @method getBatch
         * @param {String} batchId
         * @param {Function} callbackResult
         * @param {Function} callbackComplete
         */
        getBatch: function(batchId, callbackResult, callbackComplete) {
            var self = this;
            async.waterfall([
                function(callback) {
                    function wait() {
                        $.ajax({
                            url: self.getBaseUrl() + "batch/" + batchId + "/status",
                            beforeSend: self.beforeSend,
                            context: self,
                            type: "GET",
                            data: {
                                bearer_token: self.getToken(),
                                detailed: true
                            }
                        }).done(function(data) {
                            if (data.Batch && data.statusCode === 200) {
                                data.Batch.responseSize = app.fn.addAllObjectAttributes(data.Batch.Requests, "responseSize");
                                if (data.Batch.runningRequests > 0) {
                                    callbackResult(data.Batch, "wait");
                                    setTimeout(wait, 5000);
                                } else {
                                    callbackResult(data.Batch, "wait");
                                    callback(null, _.pluck(data.Batch.Requests, "id"));
                                }
                            } else {
                                callback(data);
                            }
                        }).fail(function(error) {
                            callback(error);
                        });
                    }
                    wait();
                },
                function(requestIds, callback) {
                    var downloadedRequests = 0;
                    function download() {
                        $.ajax({
                            url: self.getBaseUrl() + "batch/" + batchId,
                            beforeSend: self.beforeSend,
                            context: self,
                            type: "GET",
                            data: {
                                bearer_token: self.getToken(),
                                request_ids: requestIds.splice(0, 49).join(",")
                            }
                        }).done(function(data) {
                            var result = {};
                            result.responseSize = 0;
                            if (data.statusCode === 200) {
                                for (var i = 0, length = data.Batch.Requests.length; i < length; i++) {
                                    if (typeof data.Batch.Requests[i].response === "object") {
                                        result = app.fn.mergeObjectArrays(result, data.Batch.Requests[i].response);
                                        result.responseSize += data.Batch.Requests[i].responseSize;
                                    }
                                    downloadedRequests++;
                                }
                                delete result.cursor;
                                result.downloadedRequests = downloadedRequests;
                                result.totalRequests = data.Batch.totalRequests;
                                callbackResult(result, "download");
                                if (requestIds.length > 0) {
                                    setTimeout(download, 2000);
                                } else {
                                    callback();
                                }
                            } else {
                                callback(data);
                            }
                        }).fail(function(error) {
                            callback(error);
                        });
                    }
                    download();
                }
            ], function() {
                callbackComplete();
            });
        },
        /**
         * @method getCredentials
         * @returns {String}
         */
        getCredentials: function() {
            return "basic " + btoa(this.get("clientId") + ":" + this.get("clientSecret"));
        },
        /**
         * @method getUserSubscription
         * @param {String} userId
         * @param {Function} callback
         * @param {Object} options
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
            return app.user ? app.user.data.get("access_token") : undefined;
        },
        /**
         * @method getUsers
         * @param {Array|String} userIds
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
                        bearer_token: this.getToken(),
                        ids: userIds.splice(0, 9).join(","),
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
            $.ajax({
                url: this.getBaseUrl() + "batch?bearer_token=" + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: "POST",
                data: JSON.stringify(Array.isArray(requests) ? requests : [requests])
            }).done(function(data) {
                callback(data.Batch, data.statusCode);
            }).fail(function(error) {
                callback(error);
            });
        }
    });
});