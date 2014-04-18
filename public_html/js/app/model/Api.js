/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method Api
     */
    var Api = Backbone.Model.extend({
        initialize: function() {
            this.clientId = 'mcfarljwapiclient';
            this.clientSecret = 'e3872517fed90a820e441531548b8c';
            this.root = 'https://beta.skritter';
            this.tld = document.location.host.indexOf('.cn') > -1 ? '.cn' : '.com';
            this.base = this.root + this.tld + '/api/v' + this.get('version') + '/';
            this.credentials = 'basic ' + Base64.encode(this.clientId + ':' + this.clientSecret);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            token: null,
            version: 0
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: self.base + 'oauth2/token',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'POST',
                    data: {
                        suppress_response_codes: true,
                        grant_type: 'password',
                        client_id: self.clientId,
                        username: username,
                        password: password
                    }
                });
                promise.done(function(data) {
                    callback(data);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * Merges the key results of two object arrays.
         * 
         * @method concatObjectArray
         * @param {Array} objectArray1
         * @param {Array} objectArray2
         * @returns {Array}
         */
        concatObjectArray: function(objectArray1, objectArray2) {
            return Array.isArray(objectArray1) ? objectArray1.concat(objectArray2) : undefined;
        },
        /**
         * Using repeated calls it returns the data from a batch request of a given batch id. It works
         * best if the data is stored to the database before getting the next batch otherwise it could
         * cause mobile browsers to crash.
         * 
         * @method getBatch
         * @param {Array|Object} requests
         * @param {Function} callback1
         * @param {Function} callback2
         */
        getBatch: function(requests, callback1, callback2) {
            var self = this;
            async.waterfall([
                function(callback) {
                    self.requestBatch(requests, function(batch, status) {
                        if (status === 200) {
                            callback(null, batch);
                        } else {
                            callback(batch);
                        }
                    });
                },
                function(batch, callback) {
                    var result = {};
                    var retryCount = 0;
                    function request() {
                        var promise = $.ajax({
                            url: self.base + 'batch/' + batch.id,
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                            },
                            type: 'GET',
                            data: {
                                bearer_token: self.get('token')
                            }
                        });
                        promise.done(function(data) {
                            var batch = data.Batch;
                            var requests = batch.Requests;
                            var responseSize = 0;
                            var partialResult = {};
                            for (var i = 0, len = requests.length; i < len; i++)
                                if (requests[i].response) {
                                    _.merge(partialResult, requests[i].response, self.concatObjectArray);
                                    responseSize += requests[i].responseSize;
                                }
                            partialResult.downloadedRequests = requests.length;
                            partialResult.totalRequests = batch.totalRequests;
                            partialResult.responseSize = responseSize;
                            partialResult.runningRequests = batch.runningRequests;
                            _.merge(result, partialResult, self.concatObjectArray);
                            if (batch.runningRequests > 0 || requests.length > 0) {
                                retryCount = 0;
                                if (typeof callback2 === 'function')
                                    callback2(partialResult);
                                window.setTimeout(request, 500);
                            } else {
                                callback(null, result);
                            }
                        });
                        promise.fail(function(error) {
                            if (retryCount < 5) {
                                self.tld = self.tld === '.com' ? '.cn' : '.com';
                                window.setTimeout(request, 1000);
                                retryCount++;
                            } else {
                                callback(error);
                            }
                        });
                    }
                    request();
                }
            ], function(error, result) {
                if (error) {
                    callback1(error);
                } else {
                    callback1(result);
                }
            });
        },
        /**
         * @method getUser
         * @param {String} userId
         * @param {Function} callback
         */
        getUser: function(userId, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: self.base + 'users/' + userId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        detailed: true
                    }
                });
                promise.done(function(data) {
                    callback(data.User);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * Requests a specific batch from the server and returns the request id. Use the
         * getBatch function to get the requested data from the server.
         * 
         * @method requestBatch
         * @param {Array|Object} requests
         * @param {Function} callback
         */
        requestBatch: function(requests, callback) {
            var self = this;
            requests = Array.isArray(requests) ? requests : [requests];
            function request() {
                var promise = $.ajax({
                    url: self.base + 'batch?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'POST',
                    data: JSON.stringify(requests)
                });
                promise.done(function(data) {
                    callback(data.Batch, data.statusCode);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        }
    });

    return Api;
});