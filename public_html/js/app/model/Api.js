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
         * @method authenticateGuest
         * @param {Function} callback
         */
        authenticateGuest: function(callback) {
            $.ajax({
                url: this.base + 'oauth2/token',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'POST',
                data: {
                    suppress_response_codes: true,
                    grant_type: 'client_credentials',
                    client_id: this.clientId
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
         * @method checkBatch
         * @param {String} batchId
         * @param {Function} callback
         */
        checkBatch: function(batchId, callback) {
            $.ajax({
                url: this.base + 'batch/' + batchId + '/status',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token'),
                    detailed: true
                }
            }).done(function(data) {
                callback(data.Batch, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
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
                $.ajax({
                    url: self.base + 'reviews/errors',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        cursor: cursor,
                        offset: offset
                    }
                }).done(function(data) {
                    errors = errors.concat(data.ReviewErrors);
                    if (data.cursor) {
                        window.setTimeout(function() {
                            request(data.cursor);
                        }, 500);
                    } else {
                        callback(errors, data.statusCode);
                    }
                }).fail(function(error) {
                    callback(error, 0);
                });
            }
            request();
        },
        /**
         * @method createAnonymousUser
         * @param {String} languageCode
         * @param {Function} callback
         */
        createAnonymousUser: function(languageCode, callback) {
            languageCode = languageCode ? languageCode : undefined;
            $.ajax({
                url: this.base + 'users',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'POST',
                data: {
                    bearer_token: this.get('token'),
                    lang: languageCode
                }
            }).done(function(data) {
                callback(data.User, data.statusCode);
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
                            skritter.fn.mergeObjectArray(result, response);
                        }
                    }
                    result.downloadedRequests = data.Batch.Requests.length;
                    result.requestIds = _.pluck(data.Batch.Requests, 'id');
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
         * @method getItems
         * @param {Array|String} itemIds
         * @param {Function} callback
         * @param {Object} options
         */
        getItems: function(itemIds, callback, options) {
            var self = this;
            var result = [];
            itemIds = Array.isArray(itemIds) ? itemIds : [itemIds];
            itemIds = _.uniq(itemIds);
            options = options ? options : {};
            options.fields = options.fields ? options.fields : undefined;
            options.includeVocabs = options.includeVocabs ? options.includeVocabs : undefined;
            options.includeStroke = options.includeStroke ? options.includeStroke : undefined;
            options.includeSentences = options.includeSentences ? options.includeSentences : undefined;
            options.includeHeisigs = options.includeHeisigs ? options.includeHeisigs : undefined;
            options.includeTopMnemonics = options.includeTopMnemonics ? options.includeTopMnemonics : undefined;
            options.includeDecomps = options.includeDecomps ? options.includeDecomps : undefined;
            function request(batch) {
                $.ajax({
                    url: self.base + 'items',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        ids: batch.join('|'),
                        fields: options.fields,
                        include_vocabs: options.includeVocabs,
                        include_strokes: options.includeStroke,
                        include_sentences: options.includeSentences,
                        include_heisigs: options.includeHeisigs,
                        include_top_mnemonics: options.includeTopMnemonics,
                        include_decomps: options.includeDecomps
                    }
                }).done(function(data) {
                    if (data) {
                        skritter.fn.mergeObjectArray(result, data);
                    }
                    if (itemIds.length > 0) {
                        window.setTimeout(function() {
                            request(itemIds.splice(0, 19));
                        }, 500);
                    } else {
                        callback(result, data.statusCode);
                    }
                }).fail(function(error) {
                    callback(error, 0);
                });
            }
            request(itemIds.splice(0, 19));
        },
        /**
         * @method getProgStats
         * @param {Object} options
         * @param {Function} callback
         */
        getProgStats: function(options, callback) {
            options = options ? options : {};
            options.start = options.start ? options.start : moment().format('YYYY-MM-DD');
            options.end = options.end ? options.end : undefined;
            options.step = options.step ? options.step : undefined;
            options.lang = options.lang ? options.lang : undefined;
            options.fields = options.fields ? options.fields : undefined;
            $.ajax({
                url: this.base + 'progstats',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token'),
                    start: options.start,
                    end: options.end,
                    step: options.step,
                    lang: options.lang,
                    fields: options.fields
                }
            }).done(function(data) {
                callback(data.ProgressStats, data.statusCode);
            }).fail(function(error) {
                callback(error, 0);
            });
        },
        /**
         * @method getServerTime
         * @param {Function} callback
         */
        getServerTime: function(callback) {
            $.ajax({
                url: this.base + 'dateinfo',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token')
                }
            }).done(function(data) {
                callback({
                    serverTime: data.serverTime,
                    timeLeft: data.timeLeft,
                    today: data.today
                }, data.statusCode);
            }).fail(function(error) {
                callback(error, 0);
            });
        },
        /**
         * @method getSRSConfigs
         * @param {String} languageCode
         * @param {Function} callback
         */
        getSRSConfigs: function(languageCode, callback) {
            $.ajax({
                url: this.base + 'srsconfigs',
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token'),
                    lang: languageCode
                }
            }).done(function(data) {
                callback(data.SRSConfigs, data.statusCode);
            }).fail(function(error) {
                callback(error, 0);
            });
        },
        /**
         * @method getSubscription
         * @param {String} userId
         * @param {Function} callback
         */
        getSubscription: function(userId, callback) {
            $.ajax({
                url: this.base + 'subscriptions/' + userId,
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token')
                }
            }).done(function(data) {
                callback(data.Subscription, data.statusCode);
            }).fail(function(error) {
                callback(error, 0);
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
         * @param {Object} options
         */
        getVocabs: function(vocabIds, callback, options) {
            var self = this;
            var result = {};
            options = options ? options : {};
            options.fields = options.fields ? options.fields : undefined;
            options.includeStroke = options.includeStroke ? options.includeStroke : undefined;
            options.includeSentences = options.includeSentences ? options.includeSentences : undefined;
            options.includeHeisigs = options.includeHeisigs ? options.includeHeisigs : undefined;
            options.includeTopMnemonics = options.includeTopMnemonics ? options.includeTopMnemonics : undefined;
            options.includeDecomps = options.includeDecomps ? options.includeDecomps : undefined;
            function request() {
                $.ajax({
                    url: self.base + 'vocabs',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        ids: vocabIds.join('|'),
                        fields: options.fields,
                        include_strokes: options.includeStroke,
                        include_sentences: options.includeSentences,
                        include_heisigs: options.includeHeisigs,
                        include_top_mnemonics: options.includeTopMnemonics,
                        include_decomps: options.includeDecomps
                    }
                }).done(function(data) {
                    if (data) {
                        skritter.fn.mergeObjectArray(result, data);
                    }
                    if (vocabIds.length > 0) {
                        request(vocabIds.splice(0, 19));
                    } else {
                        callback(result, data.statusCode);
                    }
                }).fail(function(error) {
                    callback(error, error.status);
                });
            }
            request(vocabIds.splice(0, 19));
        },
        /**
         * @method getVocabList
         * @param {String} id
         * @param {Array} fields
         * @param {Function} callback
         */
        getVocabList: function(id, fields, callback) {
            fields = fields ? fields : undefined;
            $.ajax({
                url: this.base + 'vocablists/' + id,
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token')
                }
            }).done(function(data) {
                callback(data.VocabList, data.statusCode);
            }).fail(function(error) {
                callback(error, 0);
            });
        },
        /**
         * @method getVocabListSection
         * @param {String} listId
         * @param {String} sectionId
         * @param {Function} callback
         */
        getVocabListSection: function(listId, sectionId, callback) {
            $.ajax({
                url: this.base + 'vocablists/' + listId + '/sections/' + sectionId,
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'GET',
                data: {
                    bearer_token: this.get('token')
                }
            }).done(function(data) {
                callback(data.VocabListSection, data.statusCode);
            }).fail(function(error) {
                callback(error, 0);
            });
        },
        /**
         * @method getVocabLists
         * @param {Function} callback
         * @param {Object} options
         */
        getVocabLists: function(callback, options) {
            var self = this;
            var lists = [];
            options = options ? options : {};
            options.cursor = options.cursor ? options.cursor : undefined;
            options.fields = options.fields ? options.fields.join(',') : undefined;
            options.lang = options.lang ? options.lang : undefined;
            options.sort = options.sort ? options.sort : undefined;
            function request(cursor) {
                var promise = $.ajax({
                    url: self.base + 'vocablists',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        cursor: cursor,
                        lang: options.lang,
                        sort: options.sort,
                        fields: options.fields
                    }
                });
                promise.done(function(data) {
                    if (data.VocabLists)
                        lists = lists.concat(data.VocabLists);
                    if (options.cursor) {
                        callback(lists, data.statusCode);
                    } else if (data.cursor) {
                        window.setTimeout(function() {
                            request(data.cursor);
                        }, 500);
                    } else {
                        callback(lists, data.statusCode);
                    }
                });
                promise.fail(function(error) {
                    callback(error, 0);
                });
            }
            request(options.cursor);
        },
        /**
         * @method postReviews
         * @param {Array} reviews
         * @param {Function} callback
         */
        postReviews: function(reviews, callback) {
            var self = this;
            var postedReviews = [];
            function postBatch(batch) {
                $.ajax({
                    url: self.base + 'reviews?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                    },
                    type: 'POST',
                    data: JSON.stringify(batch)
                }).done(function(data) {
                    postedReviews = postedReviews.concat(batch);
                    if (reviews.length > 0) {
                        postBatch(reviews.splice(0, 99));
                    } else {
                        callback(postedReviews, data.statusCode);
                    }
                }).fail(function(error) {
                    callback(error, error.status);
                });
            }
            postBatch(reviews.splice(0, 99));
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
        },
        /**
         * @method updateUser
         * @param {Object} settings
         * @param {Function} callback
         */
        updateUser: function(settings, callback) {
            $.ajax({
                url: this.base + 'users?bearer_token=' + this.get('token'),
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'PUT',
                data: JSON.stringify(settings)
            }).done(function(data) {
                if (typeof callback === 'function') {
                    callback(data.User, data.statusCode);
                }
            }).fail(function(error) {
                if (typeof callback === 'function') {
                    callback(error, 0);
                }
            });
        },
        /**
         * @method updateVocabList
         * @param {Object} list
         * @param {Function} callback
         */
        updateVocabList: function(list, callback) {
            $.ajax({
                url: this.base + 'vocablists/' + list.id + '?bearer_token=' + this.get('token'),
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'PUT',
                data: JSON.stringify(list)
            }).done(function(data) {
                if (typeof callback === 'function') {
                    callback(data.VocabList, data.statusCode);
                }
            }).fail(function(error) {
                if (typeof callback === 'function') {
                    callback(error, 0);
                }
            });
        },
        /**
         * @method updateVocabListSection
         * @param {String} listId
         * @param {Object} section
         * @param {Function} callback
         */
        updateVocabListSection: function(listId, section, callback) {
            $.ajax({
                url: this.base + 'vocablists/' + listId + '/section/' + section.id + '?bearer_token=' + this.get('token'),
                beforeSend: _.bind(function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', this.credentials);
                }, this),
                type: 'PUT',
                data: JSON.stringify(section)
            }).done(function(data) {
                if (typeof callback === 'function') {
                    callback(data.VocabListSection);
                }
            }).fail(function(error) {
                if (typeof callback === 'function') {
                    callback(error, 0);
                }
            });
        }
    });

    return Model;
});