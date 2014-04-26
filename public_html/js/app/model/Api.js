/**
 * @module Skritter
 * @submodule Model
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
         * @method getVocabList
         * @param {String} id
         * @param {Array} fields
         * @param {Function} callback
         */
        getVocabList: function(id, fields, callback) {
            var self = this;
            fields = fields ? fields : undefined;
            function request() {
                var promise = $.ajax({
                    url: self.base + 'vocablists/' + id,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        fields: fields
                    }
                });
                promise.done(function(data) {
                    callback(data.VocabList, data.statusCode);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method getVocabListSection
         * @param {String} listId
         * @param {String} sectionId
         * @param {Function} callback
         */
        getVocabListSection: function(listId, sectionId, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'vocablists/' + listId + '/sections/' + sectionId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token')
                    }
                });
                promise.done(function(data) {
                    callback(data.VocabListSection, data.statusCode);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method getVocabLists
         * @param {String} language
         * @param {String} sort
         * @param {Array} fields
         * @param {Function} callback
         */
        getVocabLists: function(language, sort, fields, callback) {
            var self = this;
            var lists = [];
            language = language ? language : undefined;
            fields = fields ? fields : undefined;
            function request(cursor) {
                var promise = $.ajax({
                    url: Api.base + 'vocablists',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        cursor: cursor,
                        lang: language,
                        sort: sort,
                        fields: fields
                    }
                });
                promise.done(function(data) {
                    if (data.VocabLists)
                        lists = lists.concat(data.VocabLists);
                    if (data.cursor) {
                        window.setTimeout(function() {
                            request(data.cursor);
                        }, 500);
                    } else {
                        callback(lists, data.statusCode);
                    }
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * Posts batches of reviews in groups of 500 and then returns an array of the posted objects.
         * 
         * @method postReviews
         * @param {Array} reviews
         * @param {Function} callback
         */
        postReviews: function(reviews, callback) {
            var self = this;
            var postedReviews = [];
            var postBatch = function(batch) {
                var promise = $.ajax({
                    url: Api.base + 'reviews?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'POST',
                    data: JSON.stringify(batch)
                });
                promise.done(function() {
                    postedReviews = postedReviews.concat(batch);
                    if (reviews.length > 0) {
                        postBatch(reviews.splice(0, 499));
                    } else {
                        callback(postedReviews);
                    }
                });
                promise.fail(function(error) {
                    console.error('REVIEW POST ERROR', error);
                    callback(postedReviews);
                });
            };
            postBatch(reviews.splice(0, 499));
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
        },
        /**
         * @method updateUser
         * @param {Object} settings
         * @param {Function} callback
         */
        updateUser: function(settings, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'users?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'PUT',
                    data: JSON.stringify(settings)
                });
                promise.done(function(data) {
                    if (typeof callback === 'function')
                        callback(data.User);
                });
                promise.fail(function(error) {
                    console.error(error);
                });
            }
            request();
        },
        /**
         * @method updateVocabList
         * @param {Object} list
         * @param {Function} callback
         */
        updateVocabList: function(list, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'vocablists/' + list.id + '?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'PUT',
                    data: JSON.stringify(list)
                });
                promise.done(function(data) {
                    if (typeof callback === 'function')
                        callback(data.VocabList);
                });
                promise.fail(function(error) {
                    console.error(error);
                });
            }
            request();
        },
        /**
         * @method updateVocabListSection
         * @param {String} listId
         * @param {Object} section
         * @param {Function} callback
         */
        updateVocabListSection: function(listId, section, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'vocablists/' + listId + '/section/' + section.id + '?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'PUT',
                    data: JSON.stringify(section)
                });
                promise.done(function(data) {
                    if (typeof callback === 'function')
                        callback(data.VocabListSection);
                });
                promise.fail(function(error) {
                    console.error(error);
                });
            }
            request();
        }
    });

    return Api;
});