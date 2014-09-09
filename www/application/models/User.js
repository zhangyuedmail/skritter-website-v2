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
            id: 'guest',
            languageCode: '@@languageCode'
        },
        /**
         * @method createNew
         * @param {Function} callback
         * @param {Object} [options]
         */
        createNew: function(callback, options) {
            var self = this;
            async.waterfall([
                function(callback) {
                    app.api.authenticateGuest(function(result, status) {
                        if (status === 200) {
                            callback(null, result);
                        } else {
                            callback(result);
                        }
                    });
                },
                function(result, callback) {
                    app.api.createUser(result.access_token, function(user, status) {
                        if (status === 200) {
                            callback(null, user);
                        } else {
                            callback(user);
                        }
                    }, options);
                },
                function(user, callback) {
                    self.login(user.id, '', function(data, status) {
                        if (status === 200) {
                            callback(null, data);
                        } else {
                            callback(data);
                        }
                    });
                }
            ], function(error) {
                if (error) {
                    callback(error);
                } else {
                    callback();
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
         * @method getLanguageCode
         */
        getLanguageCode: function() {
            return this.get('languageCode') === '@@languageCode' ? this.settings.get('targetLang') : this.get('languageCode');
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
                async.series([
                    //load user storage instance
                    function(callback) {
                        app.storage.open(self.id, callback);
                    },
                    //check token expiration and refresh
                    function(callback) {
                        if (self.data.get('expires') - moment().unix() < 604800) {
                            app.api.refreshToken(self.data.get('refresh_token'), function(data) {
                                self.data.set(data);
                                callback();
                            }, function() {
                                callback();
                            });
                        } else {
                            callback();
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
                    //load all schedule items
                    function(callback) {
                        self.schedule.loadAll(callback);
                    }
                ], function() {
                    callback();
                });
            } else {
                callback();
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
            localStorage.removeItem(this.id + '-data');
            localStorage.removeItem(this.id + '-settings');
            localStorage.removeItem(this.id + '-subscription');
            localStorage.removeItem('_active');
            async.series([
                function(callback) {
                    app.storage.destroy(callback);
                }
            ], function() {
                app.reload();
            });
        }
    });

    return User;
});