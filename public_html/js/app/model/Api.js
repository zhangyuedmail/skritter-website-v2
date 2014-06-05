define(function() {
    /**
     * @class Api
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.clientId = 'mcfarljwapiclient';
            this.clientSecret = 'e3872517fed90a820e441531548b8c';
            this.root = 'https://beta.skritter';
            this.tld = window.document.location.host.indexOf('.cn') > -1 ? '.cn' : '.com';
            this.version = 0;
            this.base = this.root + this.tld + '/api/v' + this.version + '/';
            this.credentials = 'basic ' + window.btoa(this.clientId + ':' + this.clientSecret);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            token: null
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            $.ajax({
                url: this.base + 'oauth2/token',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'POST',
                data: {
                    suppress_response_codes: true,
                    grant_type: 'password',
                    client_id: this.clientId,
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
         * @method getBatch
         * @param {Number} batchId
         * @param {Function} callback
         */
        getBatch: function(batchId, callback) {
            $.ajax({
                url: this.base + 'batch/' + batchId,
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token')
                }
            }).done(function(data) {
                var result = {};
                var responseSize = 0;
                if (data.Batch.Requests.length > 0) {
                    for (var i = 0, length = data.Batch.Requests.length; i < length; i++) {
                        var response = data.Batch.Requests[i].response;
                        if (response) {
                            responseSize += data.Batch.Requests[i].responseSize;
                            for (var key in response) {
                                if (result[key]) {
                                    if (Array.isArray(result[key])) {
                                        result[key] = result[key].concat(response[key]);
                                    } else {
                                        result[key] = response[key];
                                    }
                                } else {
                                    result[key] = response[key];
                                }
                            }
                        }
                    }
                    result.downloadedRequests = data.Batch.Requests.length;
                    result.runningRequests = data.Batch.runningRequests;
                    result.totalRequests = data.Batch.totalRequests;
                }
                result.responseSize = responseSize;
                if (data.Batch.runningRequests > 0 || data.Batch.Requests.length > 0) {
                    callback(result, data.statusCode);
                } else {
                    callback(null, data.statusCode);
                }
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method getUser
         * @param {String} userId
         * @param {Function} callback
         */
        getUser: function(userId, callback) {
            $.ajax({
                url: this.base + 'users/' + userId,
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token'),
                    detailed: true
                }
            }).done(function(data) {
                callback(data.User, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method getVocabs
         * @param {Array} vocabIds
         * @param {Function} callback
         */
        getVocabs: function(vocabIds, callback) {
            $.ajax({
                url: this.base + 'vocabs',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token'),
                    ids: vocabIds.join('|'),
                    include_strokes: 'true',
                    include_sentences: 'true',
                    include_heisigs: 'true',
                    include_top_mnemonics: 'true',
                    include_decomps: 'true'
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
            requests = Array.isArray(requests) ? requests : [requests];
            $.ajax({
                url: this.base + 'batch?bearer_token=' + this.get('token'),
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'POST',
                data: JSON.stringify(requests)
            }).done(function(data) {
                callback(data.Batch, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        }
    });

    return Model;
});