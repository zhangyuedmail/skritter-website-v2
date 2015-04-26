/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class UserAuth
     * @extends GelatoModel
     */
    var UserAuth = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.app = options.app;
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            client: 'mcfarljwapiclient',
            credentials: 'bWNmYXJsandhcGljbGllbnQ6ZTM4NzI1MTdmZWQ5MGE4MjBlNDQxNTMxNTQ4Yjhj',
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
                callbackError(error);
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
                    include_strokes: options.include_strokes,
                    include_vocabs: options.include_vocabs,
                    lang: options.lang,
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
            options = options === undefined ? option : {};
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
                    include_decomps: options.include_decomps,
                    include_strokes: options.include_strokes,
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
            return 'basic ' + this.get('credentials');
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
            return this.app.user.auth.get('access_token');
        },
        /**
         * @method getUrl
         * @returns {String}
         */
        getUrl: function() {
            return this.get('root') + this.get('tld') + '/api/v' + this.get('version') + '/';
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
        }
    });

    return UserAuth;

});