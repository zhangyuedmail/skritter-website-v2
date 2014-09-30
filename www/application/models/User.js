/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'collections/data/DataReviews',
    'collections/user/HistoryItems',
    'collections/user/ScheduleItems',
    'models/user/UserData',
    'models/user/UserSettings',
    'models/user/UserStats',
    'models/user/UserSubscription'
], function(BaseModel, DataReviews, HistoryItems, ScheduleItems, UserData, UserSettings, UserStats, UserSubscription) {
    /**
     * @class User
     * @extends BaseModel
     */
    var User = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.data = new UserData(null, {user: this});
            this.history = new HistoryItems(null, {user: this});
            this.schedule = new ScheduleItems(null, {user: this});
            this.reviews = new DataReviews(null, {user: this});
            this.settings = new UserSettings(null, {user: this});
            this.stats = new UserStats(null, {user: this});
            this.subscription = new UserSubscription(null, {user: this});
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            id: 'guest'
        },
        /**
         * @method createNew
         * @param {Object} [settings]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        createNew: function(settings, callbackComplete, callbackError) {
            var self = this;
            var lang = app.api.getGuest('lang');
            var list = app.api.getGuest('list');
            var style = app.api.getGuest('style');
            app.dialogs.show().element('.message-title').text('Creating Account');
            async.waterfall([
                function(callback) {
                    if (self.isAuthenticated()) {
                        callback(null, self.settings.toJSON());
                    } else {
                        app.dialogs.element('.message-text').text('CREATING USER');
                        app.api.createUser({
                            lang: lang
                        }, function(user) {
                            callback(null, user);
                        }, function(error) {
                            callback(error);
                        });
                    }
                },
                function(user, callback) {
                    if (self.isAuthenticated()) {
                        callback(null, user);
                    } else {
                        app.dialogs.element('.message-text').text('SIGNING IN');
                        self.login(user.id, '', function() {
                            callback(null, user);
                        }, function(error) {
                            callback(error);
                        });
                    }
                },
                function(user, callback) {
                    app.dialogs.element('.message-text').text('CONFIGURING SETTINGS');
                    if (lang === 'zh') {
                        settings.addSimplified = ['both', 'simp'].indexOf(style) !== -1;
                        settings.addTraditional = ['both', 'trad'].indexOf(style) !== -1;
                        settings.reviewSimplified = ['both', 'simp'].indexOf(style) !== -1;
                        settings.reviewTraditional = ['both', 'trad'].indexOf(style) !== -1;
                    }
                    settings.targetLang = lang;
                    app.api.updateUser($.extend(user, settings), function(settings) {
                        self.set('id', settings.id);
                        self.settings.set(settings);
                        callback(null, user);
                    }, function(error) {
                        callback(error);
                    });
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
         * @method getAvatar
         * @param {Array|String} classes
         * @returns {String}
         */
        getAvatar: function(classes) {
            var avatar = this.settings.get('avatar') ? 'data:image/png;base64,' + this.settings.get('avatar') : 'images/avatars/default.png';
            if (classes) {
                classes = Array.isArray(classes) ? classes.join(' ') : classes;
                return "<img src='" + avatar + "' " + "class='" + classes + "'" + " />";
            } else {
                return "<img src='" + avatar + "' />";
            }
        },
        /**
         * @method getDisplayName
         */
        getDisplayName: function() {
            return this.isRegistered() ? this.settings.get('name') : 'guest';
        },
        /**
         * @method getLanguageCode
         */
        getLanguageCode: function() {
            if (['ja', 'zh'].indexOf(app.get('languageCode')) === -1) {
                return this.settings.get('targetLang');
            }
            return app.get('languageCode');
        },
        /**
         * @method getLanguageName
         */
        getLanguageName: function() {
            return this.isChinese() ? app.strings.global.chinese : app.strings.global.japanese;
        },
        getFontClass: function() {
            return this.isChinese() ? 'simkai' : '';
        },
        /**
         * @method isAuthenticated
         * @returns {Boolean}
         */
        isAuthenticated: function() {
            return this.id !== 'guest';
        },
        /**
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            return this.getLanguageCode() === 'zh' ? true : false;
        },
        /**
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            return this.getLanguageCode() === 'ja' ? true : false;
        },
        /**
         * @method isRegistered
         * @returns {Boolean}
         */
        isRegistered: function() {
            return this.settings.has('name');
        },
        /**
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            var self = this;
            if (localStorage.getItem('_active')) {
                this.set('id', localStorage.getItem('_active'));
                if (localStorage.getItem(this.id + '-data')) {
                    this.data.set(JSON.parse(localStorage.getItem(this.id + '-data')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-history')) {
                    this.history.add(JSON.parse(localStorage.getItem(this.id + '-history')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-settings')) {
                    this.settings.set(JSON.parse(localStorage.getItem(this.id + '-settings')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-stats')) {
                    this.stats.set(JSON.parse(localStorage.getItem(this.id + '-stats')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-subscription')) {
                    this.subscription.set(JSON.parse(localStorage.getItem(this.id + '-subscription')), {silent: true});
                }
                if (app.analytics) {
                    app.analytics.setUserId(this.settings.get('name'));
                }
                async.series([
                    //display general loading message
                    function(callback) {
                        app.dialogs.show('default', callback).element('.message-title').text('Getting Started');
                        app.dialogs.element('.message-text').text('');
                    },
                    //start tracking authenticated user with raygun
                    function(callback) {
                        raygun.setUser(self.settings.get('name'), false, self.settings.get('email'));
                        raygun.setVersion(app.getVersion());
                        raygun.withCustomData(self.settings.getCustomData);
                        raygun.withTags(self.settings.getTags());
                        callback();
                    },
                    //load tts plugin with language locale
                    function(callback) {
                        if (plugins.tts) {
                            async.series([
                                function (callback) {
                                    plugins.tts.startup(function () {
                                        callback();
                                    }, function () {
                                        callback();
                                    });
                                },
                                function (callback) {
                                    plugins.tts.setLanguage(self.getLanguageCode(), function () {
                                        callback();
                                    }, function () {
                                        callback();
                                    });
                                },
                                function (callback) {
                                    plugins.tts.pitch(self.settings.get('audioPitch'), function () {
                                        callback();
                                    }, function () {
                                        callback();
                                    });
                                },
                                function (callback) {
                                    plugins.tts.speed(self.settings.get('audioSpeed'), function () {
                                        callback();
                                    }, function () {
                                        callback();
                                    });
                                }
                            ]);
                        }
                        callback();
                    },
                    //load user storage instance
                    function(callback) {
                        app.storage.open(self.id, callback);
                    },
                    //check token expiration and refresh
                    function(callback) {
                        if (self.data.get('expires') - moment().unix() > 604800) {
                            callback();
                        } else {
                            app.dialogs.element('.message-text').text('REFRESHING TOKEN');
                            app.api.refreshToken(self.data.get('refresh_token'), function(data) {
                                self.data.set(data);
                                callback();
                            }, function() {
                                callback();
                            });
                        }
                    },
                    //enable list selected by new users
                    function(callback) {
                        if (app.api.hasGuest() && app.api.getGuest('list') && !app.api.getGuest('enabledList')) {
                            app.dialogs.element('.message-text').text('ENABLING LIST');
                            app.api.updateVocabList({
                                id: app.api.getGuest('list'),
                                studyingMode: 'adding'
                            }, function() {
                                app.api.setGuest('enabledList', true);
                                callback();
                            }, function(error) {
                                callback(error);
                            });
                        } else {
                            callback();
                        }
                    },
                    //added initial items for new users
                    function(callback) {
                        if (app.api.hasGuest() && !app.api.getGuest('addedItems')) {
                            app.dialogs.element('.message-text').text('ADDING ITEMS');
                            self.data.addItems({limit: 10, fetch: false}, function() {
                                app.api.setGuest('addedItems', true);
                                callback();
                            }, function(error) {
                                callback(error);
                            });
                        } else {
                            callback();
                        }
                    },
                    //sync items from server
                    function(callback) {
                        if (self.data.get('lastItemSync')) {
                            if (app.isLocalhost()) {
                                callback();
                            } else {
                                app.dialogs.element('.message-text').text('UPDATING ITEMS');
                                app.user.data.sync(null, callback, function() {
                                    callback();
                                });
                            }
                        } else {
                            app.dialogs.element('.message-text').text('REQUESTING DATA');
                            self.data.downloadAll(callback, function(error) {
                                callback(error);
                            });
                        }
                    },
                    //update subscription from server
                    function(callback) {
                        if (app.isLocalhost()) {
                            callback();
                        } else {
                            app.dialogs.element('.message-text').text('CHECKING SUBSCRIPTION');
                            app.user.subscription.fetch(callback);
                        }
                    },
                    //update user from server
                    function(callback) {
                        if (app.isLocalhost()) {
                            callback();
                        } else {
                            app.dialogs.element('.message-text').text('UPDATING USER');
                            app.user.settings.fetch(callback);
                        }
                    },
                    //load all schedule items
                    function(callback) {
                        app.dialogs.element('.message-text').text('SCHEDULING');
                        self.schedule.loadAll(callback);
                    },
                    //load all vocablists
                    function(callback) {
                        self.data.vocablists.loadAll(callback);
                    },
                    //load all srsconfigs
                    function(callback) {
                        self.data.srsconfigs.loadAll(callback);
                    },
                    //load all reviews
                    function(callback) {
                        self.reviews.loadAll(callback);
                    },
                    //start background sync interval
                    function(callback) {
                        setInterval(function() {
                            self.data.sync();
                        }, moment.duration(1, 'minute').asMilliseconds());
                        callback();
                    }
                ], function(error) {
                    if (error) {
                        app.dialogs.element('.message-title').text('Something went wrong.');
                        app.dialogs.element('.message-text').text('Check your connection and click reload.');
                        app.dialogs.element('.message-other').html(app.fn.bootstrap.button('Reload', {level: 'primary'}));
                        app.dialogs.element('.message-other button').on('vclick', app.reload);
                        console.error('USER ERROR:', error);
                    } else {
                        app.dialogs.hide(function() {
                            app.api.clearGuest();
                            callback(self);
                        });
                    }
                });
            } else {
                callback(this);
            }
        },
        /**
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        login: function(username, password, callbackComplete, callbackError) {
            var self = this;
            app.api.authenticateUser(username, password, function(data) {
                self.set('id', data.user_id);
                self.data.set(data);
                async.parallel([
                    function(callback) {
                        self.settings.fetch(callback);
                    },
                    function(callback) {
                        self.subscription.fetch(callback);
                    }
                ], function() {
                    localStorage.setItem('_active', data.user_id);
                    callbackComplete(data);
                });
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method logout
         * @param {Boolean} [skipDialog]
         */
        logout: function(skipDialog) {
            if (this.isAuthenticated()) {
                if (skipDialog) {
                    this.remove();
                } else {
                    app.sidebars.hide();
                    app.dialogs.show('logout');
                    app.dialogs.element('button.logout').on('vclick', this.remove);
                }
            } else {
                app.reload();
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            localStorage.removeItem(app.user.id + '-data');
            localStorage.removeItem(app.user.id + '-settings');
            localStorage.removeItem(app.user.id + '-stats');
            localStorage.removeItem(app.user.id + '-subscription');
            localStorage.removeItem('_active');
            async.series([
                function(callback) {
                    app.storage.destroy(callback);
                }
            ], function() {
                app.api.clearGuest();
                app.reload();
            });
        }
    });

    return User;
});