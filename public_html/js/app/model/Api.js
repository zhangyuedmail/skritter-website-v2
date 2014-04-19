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
                    callback(data, data.statusCode);
                });
                promise.fail(function(error) {
                    callback(error, 0);
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
         * @param {Number} batchId
         * @param {Function} callback
         */
        getBatch: function(batchId, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: self.base + 'batch/' + batchId,
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
                    if (batch.runningRequests > 0 || requests.length > 0) {
                        callback(partialResult, data.statusCode);
                    } else {
                        callback(null, 200);
                    }
                });
                promise.fail(function(error) {
                    callback(error, 0);
                });
            }
            request();
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
                    callback(data.User, data.statusCode);
                });
                promise.fail(function(error) {
                    callback(error, 0);
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
                    callback(error, 0);
                });
            }
            request();
        }
    });

    return Api;
});