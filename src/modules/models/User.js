/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel',
    'modules/models/UserAuthentication',
    'modules/models/UserData',
    'modules/models/UserSettings',
    'modules/models/UserSubscription'
], function(
    GelatoModel,
    UserAuthentication,
    UserData,
    UserSettings,
    UserSubscription
) {

    /**
     * @class User
     * @extends GelatoModel
     */
    var User = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.authentication = new UserAuthentication();
            this.data = new UserData();
            this.settings = new UserSettings();
            this.subscription = new UserSubscription();
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getDataPath
         * @param {String} path
         * @param {Boolean} [includeLanguageCode]
         * @returns {String}
         */
        getDataPath: function(path, includeLanguageCode) {
            return includeLanguageCode ? this.id + '-' + this.getLanguageCode() + '-' + path : this.id + '-' + path;
        },
        /**
         * @method getDatabaseName
         * @returns {String}
         */
        getDatabaseName: function() {
            return this.id + '-' + this.getLanguageCode();
        },
        /**
         * @method getLanguageCode
         * @returns {String}
         */
        getLanguageCode: function() {
            return this.settings.get('targetLang');
        },
        /**
         * @method isLoggedIn
         * @returns {Boolean}
         */
        isLoggedIn: function() {
            return this.authentication.has('user_id');
        },
        /**
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            return this.getLanguageCode() === 'zh';
        },
        /**
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            return this.getLanguageCode() === 'ja';
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        load: function(callbackSuccess, callbackError) {
            this.set('id', app.getSetting('user') || 'guest');
            this.authentication.load();
            this.settings.load();
            this.subscription.load();
            if (this.isLoggedIn()) {
                this.loadUser(callbackSuccess, callbackError);
            } else {
                this.loadGuest(callbackSuccess, callbackError);
            }
        },
        /**
         * @method loadGuest
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        loadGuest: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    if (self.authentication.isExpired()) {
                        app.api.authenticateGuest(function(result) {
                            self.set('id', 'guest');
                            self.authentication.set('created', Moment().unix());
                            self.authentication.set(result, {merge: true});
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
                    callbackSuccess();
                }
            });
        },
        /**
         * @method loadUser
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        loadUser: function(callbackSuccess, callbackError) {
            var self = this;
            app.dialog.show('loading');
            Async.series([
                function(callback) {
                    if (self.authentication.isExpired()) {
                        self.authentication.refresh(function() {
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    } else {
                        callback();
                    }
                },
                function(callback) {
                    self.data.load(callback, callback);
                },
                function(callback) {
                    self.data.items.fetchMissing(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(status) {
                        app.dialog.element.find('.modal-message').text(status + '%');
                    });
                },
                function(callback) {
                    self.data.items.fetchChanged(function() {
                        callback();
                    }, function(error) {
                       callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    app.dialog.hide();
                    callbackSuccess();
                }
            });
        },
        /**
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        login: function(username, password, callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    app.api.authenticateUser(username, password, function(result) {
                        self.set('id', result.user_id);
                        self.authentication.set('created', Moment().unix());
                        self.authentication.set(result, {merge: true});
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    app.user.settings.fetch(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    app.user.subscription.fetch(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.data.load(callback, callback);
                },
                function(callback) {
                    app.user.data.items.fetchIds(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('USER LOGIN ERROR:', error);
                    callbackError(error);
                } else {
                    var now = Moment().unix();
                    self.data.set({lastItemUpdate: now, lastVocabUpdate: now});
                    app.setSetting('user', self.id);
                    callbackSuccess();
                }
            });
        },
        /**
         * @method loginGuest
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        loginGuest: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    app.api.authenticateGuest(function(result) {
                        self.set('id', 'guest');
                        self.authentication.set(result, {merge: true});
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('GUEST LOGIN ERROR:', error);
                    callbackError(error);
                } else {
                    app.setSetting('user', self.id);
                    callbackSuccess();
                }
            });
        },
        /**
         * @method logout
         */
        logout: function() {
            this.data.storage.destroy(function() {
                localStorage.removeItem(app.user.getDataPath('authentication', false));
                localStorage.removeItem(app.user.getDataPath('ja-data', false));
                localStorage.removeItem(app.user.getDataPath('zh-data', false));
                localStorage.removeItem(app.user.getDataPath('settings', false));
                localStorage.removeItem(app.user.getDataPath('ja-stats', false));
                localStorage.removeItem(app.user.getDataPath('zh-stats', false));
                localStorage.removeItem(app.user.getDataPath('subscription', false));
                app.removeSetting('user');
                app.reload();
            }, function(error) {
                console.error('USER LOGOUT ERROR:', error);
            });
        }
    });

    return User;

});