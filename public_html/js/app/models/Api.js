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
            Api.clientId = 'mcfarljwapiclient';
            Api.clientSecret = 'e3872517fed90a820e441531548b8c';
            Api.root = 'https://beta.skritter';
            Api.tld = document.location.host.indexOf('.cn') > -1 ? '.cn' : '.com';
            Api.base = Api.root + Api.tld + '/api/v' + this.get('version') + '/';
            Api.credentials = 'basic ' + Base64.encode(Api.clientId + ':' + Api.clientSecret);
            if (localStorage.getItem('guest'))
                this.authenticateGuest(JSON.parse(localStorage.getItem('guest')));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            token: null,
            version: 0
        },
        audioBase: function() {
            return Api.root + Api.tld + '/';
        },
        /**
         * @method authenticateGuest
         * @param {Object} guest
         * @param {Function} callback
         */
        authenticateGuest: function(guest, callback) {
            var self = this;
            if (guest) {
                this.set('token', guest.access_token);
                if (typeof callback === 'function')
                    callback();
            } else {
                var promise = $.ajax({
                    url: Api.base + 'oauth2/token',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'POST',
                    data: {
                        suppress_response_codes: true,
                        grant_type: 'client_credentials',
                        client_id: Api.clientId
                    }
                });
                promise.done(function(data) {
                    self.set('token', data.access_token);
                    localStorage.setItem('guest', JSON.stringify(data));
                    if (typeof callback === 'function')
                        callback();
                });
                promise.fail(function(error) {
                    console.error(error);
                });
            }
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            password = password ? password : '';
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'oauth2/token',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'POST',
                    data: {
                        suppress_response_codes: true,
                        grant_type: 'password',
                        client_id: Api.clientId,
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
         * @method checkBatch
         * @param {String} batchId
         * @param {Boolean} detailed
         * @param {Function} callback
         */
        checkBatch: function(batchId, detailed, callback) {
            var self = this;
            detailed = detailed ? detailed : false;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'batch/' + batchId + '/status',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        detailed: detailed
                    }
                });
                promise.done(function(data) {
                    callback(data.Batch);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method checkReviewErrors
         * @param {Number} offset
         * @param {Function} callback
         */
        checkReviewErrors: function(offset, callback) {
            var self = this;
            var errors = [];
            offset = offset ? offset : undefined;
            function request(cursor) {
                var promise = $.ajax({
                    url: Api.base + '/reviews/errors',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        cursor: cursor,
                        offset: offset
                    }
                });
                promise.done(function(data) {
                    errors = errors.concat(data.ReviewErrors);
                    if (data.cursor) {
                        window.setTimeout(function() {
                            request(data.cursor);
                        }, 1000);
                    } else {
                        callback(errors);
                    }
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method createUser
         * @param {String} language
         * @param {Function} callback
         */
        createUser: function(language, callback) {
            var self = this;
            language = language ? language : 'zh';
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'users',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'POST',
                    data: {
                        bearer_token: self.get('token'),
                        lang: language
                    }
                });
                promise.done(function(data) {
                    console.log(data);
                    //callback(data);
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
         * @param {Number} batchId
         * @param {Function} callback
         */
        getBatch: function(batchId, callback) {
            var self = this;
            var retry = 0;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'batch/' + batchId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
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
                    var result = {};
                    for (var i = 0, len = requests.length; i < len; i++)
                        if (requests[i].response) {
                            _.merge(result, requests[i].response, self.concatObjectArray);
                            responseSize += requests[i].responseSize;
                        }
                    result.downloadedRequests = requests.length;
                    result.totalRequests = batch.totalRequests;
                    result.responseSize = responseSize;
                    result.runningRequests = batch.runningRequests;
                    retry = 0;
                    if (batch.runningRequests > 0 || requests.length > 0) {
                        callback(result);
                    } else {
                        callback();
                    }
                });
                promise.fail(function(error) {
                    if (retry < 5) {
                        Api.tld = Api.tld === '.com' ? '.cn' : '.com';
                        window.setTimeout(request, 5000);
                        retry++;
                    } else {
                        callback(error);
                    }
                });
            }
            request();
        },
        /**
         * @method getProgressStats
         * @param {String} language
         * @param {Object} options
         * @param {Function} callback
         */
        getProgressStats: function(language, options, callback) {
            var data = $.extend({
                bearer_token: this.get('token'),
                lang: language
            }, options);
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'progstats',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: data
                });
                promise.done(function(data) {
                    callback(data.ProgressStats);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method getSRSConfigs
         * @param {String} language
         * @param {Function} callback
         */
        getSRSConfigs: function(language, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'srsconfigs',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        lang: language
                    }
                });
                promise.done(function(data) {
                    callback(data.SRSConfigs);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method getReviewErrors
         * @param {Number} offset
         * @param {Function} callback
         */
        getReviewErrors: function(offset, callback) {
            var self = this;
            var reviewErrors = [];
            function request(cursor) {
                var promise = $.ajax({
                    url: Api.base + 'reviews/errors',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        cursor: cursor,
                        offset: offset ? offset : 0
                    }
                });
                promise.done(function(data) {
                    reviewErrors = reviewErrors.concat(data.ReviewErrors);
                    if (data.cursor) {
                        window.setTimeout(function() {
                            request(data.cursor);
                        }, 500);
                    } else {
                        console.log('REVIEW ERRORS', reviewErrors);
                        callback(reviewErrors);
                    }
                });
                promise.fail(function(error) {
                    callback(error);
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
                    url: Api.base + 'vocablists/' + id,
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
                    callback(data.VocabList);
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
                    callback(data.VocabListSection);
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
                        callback(lists);
                    }
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method getVocab
         * @param {Array|String} vocabIds
         * @param {Function} callback
         */
        getVocab: function(vocabIds, callback) {
            var self = this;
            var ids = Array.isArray(vocabIds) ? vocabIds : [vocabIds];
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'vocabs',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        ids: ids.join('|'),
                        include_strokes: 'true',
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
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
         * @method getUser
         * @param {String} userId
         * @param {Function} callback
         */
        getUser: function(userId, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'users/' + userId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
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
         * @param {Array} requests
         * @param {Function} callback
         */
        requestBatch: function(requests, callback) {
            var self = this;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'batch?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'POST',
                    data: JSON.stringify(requests)
                });
                promise.done(function(data) {
                    callback(data.Batch);
                });
                promise.fail(function(error) {
                    callback(error);
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