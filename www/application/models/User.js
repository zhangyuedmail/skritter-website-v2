/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'collections/schedule/ScheduleItems',
    'models/user/UserData',
    'models/user/UserSettings',
    'models/user/UserSubscription'
], function(BaseModel, ScheduleItems, UserData, UserSettings, UserSubscription) {
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
            this.schedule = new ScheduleItems(null, {user: this});
            this.settings = new UserSettings(null, {user: this});
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
            async.waterfall([
                function(callback) {
                    if (self.isAuthenticated()) {
                        callback(null, self.settings.toJSON());
                    } else {
                        app.api.createUser({
                            addSimplified: ['both', 'simp'].indexOf(style) !== -1,
                            addTraditional: ['both', 'trad'].indexOf(style) !== -1,
                            reviewSimplified: ['both', 'simp'].indexOf(style) !== -1,
                            reviewTraditional: ['both', 'trad'].indexOf(style) !== -1,
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
                        self.login(user.id, '', function() {
                            callback(null, user);
                        }, function(error) {
                            callback(error);
                        });
                    }
                },
                function(user, callback) {
                    if (settings) {
                        app.api.updateUser($.extend(user, settings), function(settings) {
                            self.settings.set(settings);
                            callback(null, user);
                        }, function(error) {
                            callback(error);
                        });
                    } else {
                        callback(null, user);
                    }
                },
                function(user, callback) {
                    if (list) {
                        app.api.updateVocabList({
                            id: list,
                            studyingMode: 'adding'
                        }, function() {
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    } else {
                        callback();
                    }
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
         * @method isGuest
         * @returns {Boolean}
         */
        isGuest: function() {
            return this.id === 'guest';
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
                if (localStorage.getItem(this.id + '-settings')) {
                    this.settings.set(JSON.parse(localStorage.getItem(this.id + '-settings')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-subscription')) {
                    this.subscription.set(JSON.parse(localStorage.getItem(this.id + '-subscription')), {silent: true});
                }
                if (app.analytics) {
                    app.analytics.setUserId(this.settings.get('name'));
                }
                async.series([
                    //load user storage instance
                    function(callback) {
                        app.storage.open(self.id, callback);
                    },
                    //check token expiration and refresh
                    function(callback) {
                        if (self.data.get('expires') - moment().unix() > 604800) {
                            callback();
                        } else {
                            app.api.refreshToken(self.data.get('refresh_token'), function(data) {
                                self.data.set(data);
                                callback();
                            }, function() {
                                callback();
                            });
                        }
                    },
                    //perform initial item sync
                    function(callback) {
                        if (self.data.get('lastItemSync')) {
                            callback();
                        } else {
                            self.data.downloadAll(callback);
                        }
                    },
                    //display general loading message
                    function(callback) {
                        app.dialogs.show('default', callback).element('.message-title').text('Loading');
                    },
                    //load all schedule vocablists
                    function(callback) {
                        self.data.vocablists.loadAll(callback);
                    },
                    //load all schedule srsconfigs
                    function(callback) {
                        self.data.srsconfigs.loadAll(callback);
                    },
                    //load all schedule items
                    function(callback) {
                        self.schedule.loadAll(callback);
                    }
                ], function() {
                    app.dialogs.hide(function() {
                        callback(self);
                    });
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
                        self.settings.sync(callback);
                    },
                    function(callback) {
                        self.subscription.sync(callback);
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