var GelatoModel = require('gelato/modules/model');

/**
 * @class Api
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        client: 'Web',
        keys: {
            android: 'c2tyaXR0ZXJhbmRyb2lkOmRjOTEyYzAzNzAwMmE3ZGQzNWRkNjUxZjBiNTA3NA==',
            ios: 'c2tyaXR0ZXJpb3M6NGZmYjFiZDViYTczMWJhNTc1YWI4OWYzYzY5ODQ0',
            web: 'c2tyaXR0ZXJ3ZWI6YTI2MGVhNWZkZWQyMzE5YWY4MTYwYmI4ZTQwZTdk'
        },
        root: 'https://beta.skritter',
        tld: location.host.indexOf('.cn') > -1 ? '.cn' : '.com',
        version: 0
    },
    /**
     * @method authenticateGuest
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    authenticateGuest: function(callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'oauth2/token',
            headers: this.getHeaders(),
            context: this,
            type: 'POST',
            data: {
                client_id: this.get('client'),
                grant_type: 'client_credentials'
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error.responseJSON);
        });
    },
    /**
     * @method authenticateUser
     * @param {String} username
     * @param {String} password
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    authenticateUser: function(username, password, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'oauth2/token',
            headers: this.getHeaders(),
            context: this,
            type: 'POST',
            data: {
                client_id: this.get('client'),
                grant_type: 'password',
                password: password,
                username: username
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error.responseJSON);
        });
    },
    /**
     * @method createVocabList
     * @param {Object} list
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    createVocabList: function(list, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'vocablists' +
            '?bearer_token=' + this.getToken(),
            headers: this.getHeaders(),
            context: this,
            type: 'POST',
            data: JSON.stringify(list)
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data.VocabList);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method fetchDate
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchDate: function(callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'dateinfo',
            headers: this.getHeaders(),
            context: self,
            type: 'GET',
            data: {
                bearer_token: this.getToken()
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method fetchItemIds
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     * @param {Function} [callbackStatus]
     */
    fetchItemIds: function(options, callbackSuccess, callbackError, callbackStatus) {
        var self = this;
        var items = [];
        options = options || {};
        (function next(cursor) {
            self.fetchItems({
                cursor: cursor,
                lang: options.lang,
                sort: 'changed',
                ids_only: true,
                limit: 500
            }, function(result) {
                items = items.concat(result.Items);
                if (typeof callbackStatus === 'function') {
                    callbackStatus(items.length);
                }
                if (result.cursor) {
                    next(result.cursor);
                } else {
                    callbackSuccess({Items: items});
                }
            }, function(error) {
                callbackError(error);
            });
        })();
    },
    /**
     * @method fetchItems
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchItems: function(options, callbackSuccess, callbackError) {
        options = options || {};
        $.ajax({
            url: this.getUrl() + 'items',
            headers: this.getHeaders(),
            context: self,
            type: 'GET',
            data: {
                bearer_token: this.getToken(),
                cursor: options.cursor,
                fields: options.fields,
                ids: options.ids,
                ids_only: options.ids_only,
                include_contained: options.include_contained,
                include_decomps: options.include_decomps,
                include_sentences: options.include_sentences,
                include_strokes: options.include_strokes,
                include_top_mnemonics: options.include_top_mnemonics,
                include_vocabs: options.include_vocabs,
                lang: options.lang,
                limit: options.limit,
                offset: options.offset,
                parts: options.parts,
                sort: options.sort,
                styles: options.styles
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method fetchItemsDue
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchItemsDue: function(options, callbackSuccess, callbackError) {
        options = options || {};
        var total = 0;
        $.ajax({
            url: this.getUrl() + 'items/due',
            headers: this.getHeaders(),
            context: self,
            type: 'GET',
            data: {
                bearer_token: this.getToken(),
                lang: options.lang,
                parts: options.parts,
                styles: options.styles
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                for (var part in data.due) {
                    var group = data.due[part];
                    for (var style in group) {
                        total += group[style];
                    }
                }
                data.total = total;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method fetchReviewErrors
     * @param {Number} [offset]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchReviewErrors: function(offset, callbackSuccess, callbackError) {
        var self = this;
        var errors = [];
        (function next(cursor) {
            $.ajax({
                url: self.getUrl() + 'reviews/errors',
                headers: self.getHeaders(),
                context: self,
                type: 'GET',
                data: {
                    bearer_token: self.getToken(),
                    cursor: cursor,
                    offset: offset
                }
            }).done(function(data) {
                errors = errors.concat(data.ReviewErrors);
                if (data.statusCode === 200) {
                    if (data.cursor) {
                        setTimeout(next, 100, data.cursor);
                    } else {
                        callbackSuccess(errors);
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
     * @method fetchStats
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchStats: function(options, callbackSuccess, callbackError) {
        options = options || {};
        options.start = options.start || Moment().format('YYYY-MM-DD');
        $.ajax({
            url: this.getUrl() + 'progstats',
            headers: this.getHeaders(),
            context: this,
            type: 'GET',
            data: {
                bearer_token: this.getToken(),
                end: options.end,
                fields: options.fields,
                lang: options.lang,
                start: options.start,
                step: options.step
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                callbackSuccess(data.ProgressStats);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method fetchSubscription
     * @param {String} userId
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchSubscription: function(userId, options, callbackSuccess, callbackError) {
        options = options === undefined ? options : {};
        $.ajax({
            url: this.getUrl() + 'subscriptions/' + userId,
            header: this.getHeaders(),
            context: this,
            type: 'GET',
            data: {
                bearer_token: this.getToken(),
                fields: options.fields
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                var subscription = data.Subscription;
                if (data.Payment !== undefined) {
                    subscription.payment = data.Payment;
                }
                if (data.subscriptionCancelled !== undefined) {
                    subscription.subscriptionCancelled = data.subscriptionCancelled;
                }
                callbackSuccess(subscription);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method fetchUsers
     * @param {Array|String} userIds
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchUsers: function(userIds, options, callbackSuccess, callbackError) {
        var self = this;
        var users = [];
        options = options || {};
        userIds = Array.isArray(userIds) ? userIds : [userIds];
        (function next() {
            $.ajax({
                url: self.getUrl() + 'users',
                headers: self.getHeaders(),
                context: self,
                type: 'GET',
                data: {
                    bearer_token: self.getToken(),
                    ids: userIds.splice(0, 4).join(','),
                    fields: options.fields
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    users = users.concat(data.Users);
                    if (userIds.length > 0) {
                        next();
                    } else {
                        if (users.length === 1) {
                            callbackSuccess(users[0]);
                        } else {
                            callbackSuccess(users);
                        }
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
     * @method fetchVocabList
     * @param {Array|String} listId
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchVocabList: function(listId, options, callbackSuccess, callbackError) {
        var self = this;
        var listIds = Array.isArray(listId) ? listId : [listId];
        var lists = [];
        options = options || {};
        (function next() {
            $.ajax({
                url: self.getUrl() + 'vocablists/' + listIds.slice(0, 1),
                headers: self.getHeaders(),
                context: self,
                type: 'GET',
                data: {
                    bearer_token: self.getToken(),
                    fields: options.fields,
                    sectionFields: options.sectionFields
                }
            }).done(function(data) {
                lists.push(data.VocabList);
                listIds.splice(0, 1);
                if (data.statusCode === 200) {
                    if (listIds.length) {
                        next();
                    } else {
                        callbackSuccess(lists);
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
     * @method fetchVocabLists
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchVocabLists: function(options, callbackSuccess, callbackError) {
        options = options || {};
        $.ajax({
            url: this.getUrl() + 'vocablists',
            headers: this.getHeaders(),
            context: self,
            type: 'GET',
            data: {
                bearer_token: this.getToken(),
                cursor: options.cursor,
                fields: options.fields,
                ids: options.ids,
                limit: options.limit,
                offset: options.offset,
                sort: options.sort
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method fetchVocabs
     * @param {Object} [options]
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    fetchVocabs: function(options, callbackSuccess, callbackError) {
        options = options || {};
        $.ajax({
            url: this.getUrl() + 'vocabs',
            headers: this.getHeaders(),
            context: self,
            type: 'GET',
            data: {
                bearer_token: this.getToken(),
                fields: options.fields,
                ids: options.ids,
                include_containing: options.include_containing,
                include_decomps: options.include_decomps,
                include_heisigs: options.include_heisigs,
                include_sentences: options.include_sentences,
                include_strokes: options.include_strokes,
                include_top_mnemonics: options.include_top_mnemonics,
                q: options.q
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method getCredentials
     * @returns {String}
     */
    getCredentials: function() {
        var credentials = '';
        var platform = window.device ? window.device.platform : 'Web';
        switch (platform) {
            case 'Android':
                this.set('client', 'skritterandroid');
                credentials = this.get('keys').android;
                break;
            case 'iOS':
                this.set('client', 'skritterios');
                credentials = this.get('keys').ios;
                break;
            default:
                this.set('client', 'skritterweb');
                credentials = this.get('keys').web;

        }
        return 'basic ' + credentials;
    },
    /**
     * @method getHeaders
     * @returns {Object}
     */
    getHeaders: function() {
        return {'Authorization': this.getCredentials()};
    },
    /**
     * @method getToken
     * @returns {String}
     */
    getToken: function() {
        return app.user.credentials.get('access_token');
    },
    /**
     * @method getUrl
     * @returns {String}
     */
    getUrl: function() {
        return this.get('root') + this.get('tld') + '/api/v' + this.get('version') + '/';
    },
    /**
     * @method postContact
     * @param {String} domain
     * @param {Object} body
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    postContact: function(domain, body, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + domain +
            '?bearer_token=' + this.getToken(),
            headers: this.getHeaders(),
            context: this,
            type: 'POST',
            data: JSON.stringify(body)
        }).done(function(data) {
            if (data.statusCode === 200) {
                callbackSuccess();
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method postReviews
     * @param {Array} reviews
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    postReviews: function(reviews, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'reviews' +
            '?bearer_token=' + this.getToken() +
            '&spaceItems=false',
            headers: this.getHeaders(),
            context: this,
            type: 'POST',
            data: JSON.stringify(reviews)
        }).done(function(data) {
            if (data.statusCode === 200) {
                callbackSuccess();
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method putSubscription
     * @param {String} userId
     * @param {Object} subscription
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    putSubscription: function(userId, subscription, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'subscriptions/' + userId +
            '?bearer_token=' + this.getToken(),
            headers: this.getHeaders(),
            context: this,
            type: 'PUT',
            data: JSON.stringify(subscription)
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method putUser
     * @param {Object} user
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    putUser: function(user, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'users/' + user.id +
            '?bearer_token=' + this.getToken(),
            headers: this.getHeaders(),
            context: this,
            type: 'PUT',
            data: JSON.stringify(user)
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data.User);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method putVocab
     * @param {Object} vocab
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    putVocab: function(vocab, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'vocabs/' + vocab.id +
            '?bearer_token=' + this.getToken(),
            headers: this.getHeaders(),
            context: this,
            type: 'PUT',
            data: JSON.stringify(vocab)
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method putVocabList
     * @param {Object} list
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    putVocabList: function(list, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'vocablists/' + list.id +
            '?bearer_token=' + this.getToken(),
            headers: this.getHeaders(),
            context: this,
            type: 'PUT',
            data: JSON.stringify(list)
        }).done(function(data) {
            if (data.statusCode === 200) {
                delete data.statusCode;
                callbackSuccess(data.VocabList);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method refreshToken
     * @param {String} token
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    refreshToken: function(token, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'oauth2/token',
            headers: this.getHeaders(),
            context: this,
            type: 'POST',
            data: {
                grant_type: 'refresh_token',
                client_id: this.get('clientId'),
                refresh_token: token
            }
        }).done(function(data) {
            if (data.statusCode === 200) {
                callbackSuccess(data);
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    },
    /**
     * @method resetPassword
     * @param {String} indentifier
     * @param {Function} callbackSuccess
     * @param {Function} callbackError
     */
    resetPassword: function(indentifier, callbackSuccess, callbackError) {
        $.ajax({
            url: this.getUrl() + 'reset-password' +
            '?bearer_token=' + this.getToken(),
            headers: this.getHeaders(),
            context: this,
            type: 'POST',
            data: JSON.stringify({input: indentifier})
        }).done(function(data) {
            if (data.statusCode === 200) {
                callbackSuccess();
            } else {
                callbackError(data);
            }
        }).fail(function(error) {
            callbackError(error);
        });
    }
});
