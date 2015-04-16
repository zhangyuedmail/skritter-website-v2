/**
 * @module Application
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel',
    'core/modules/GelatoStorage',
    'modules/models/UserAuth',
    'modules/models/UserData',
    'modules/models/UserSettings',
    'modules/models/UserSubscription'
], function(GelatoModel, GelatoStorage, UserAuth, UserData, UserSettings, UserSubscription) {

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
            this.auth = new UserAuth(null, {user: this});
            this.data = new UserData(null, {user: this});
            this.storage = new GelatoStorage();
            this.settings = new UserSettings(null, {user: this});
            this.subscription = new UserSubscription(null, {user: this});
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method getCachePath
         * @param {String} path
         * @param {Boolean} [includeLanguageCode]
         * @returns {String}
         */
        getCachePath: function(path, includeLanguageCode) {
            if (includeLanguageCode) {
                return this.id + '-' + this.getLanguageCode() + '-' + path;
            }
            return this.id + '-' + path;
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
         * @method isAuthenticated
         * @returns {Boolean}
         */
        isAuthenticated: function() {
            return this.has('id');
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
            var self = this;
            this.set('id', localStorage.getItem('_active'), {silent: true});
            Async.series([
                //check user authentication status
                function(callback) {
                    if (self.id) {
                        console.log('USER:', self.id);
                        callback();
                    } else {
                        callbackSuccess();
                    }
                },
                //load user authorization
                function(callback) {
                    self.auth.load(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                //load user settings
                function(callback) {
                    self.settings.load(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                //load user subscription
                function(callback) {
                    self.subscription.load(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                //open database for usage
                function(callback) {
                    self.loadStorage(callback);
                },
                //load user data
                function(callback) {
                    self.data.load(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                //initialize missing item fetch
                function(callback) {
                    /** TODO: enable this for mobile only
                     if (self.data.items.hasMissing()) {
                        self.data.items.fetchMissing();
                    }
                     **/
                    callback();
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
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         * @param {Function} [callbackStatus]
         */
        login: function(username, password, callbackSuccess, callbackError, callbackStatus) {
            var self = this;
            Async.series([
                function(callback) {
                    app.api.authenticateUser(username, password, function(data) {
                        self.set('id', data.user_id);
                        self.auth.set(data);
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.settings.fetch(callback);
                },
                function(callback) {
                    self.subscription.fetch(callback);
                },
                function(callback) {
                    indexedDB.deleteDatabase(self.getDatabaseName());
                    self.loadStorage(callback);
                },
                function(callback) {
                    self.data.items.fetchIds(callback, function(status) {
                        if (typeof callbackStatus === 'function') {
                            callbackStatus(status);
                        }
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('USER LOGIN ERROR:', error);
                    callbackError(error);
                } else {
                    localStorage.setItem('_active', self.id);
                    callbackSuccess();
                }
            });
        },
        /**
         * @method logout
         * @param {Function} [callback]
         */
        logout: function(callback) {
            localStorage.removeItem(this.getCachePath('auth', false));
            localStorage.removeItem(this.getCachePath('ja-data', false));
            localStorage.removeItem(this.getCachePath('zh-data', false));
            localStorage.removeItem(this.getCachePath('settings', false));
            localStorage.removeItem(this.getCachePath('ja-stats', false));
            localStorage.removeItem(this.getCachePath('zh-stats', false));
            localStorage.removeItem(this.getCachePath('subscription', false));
            localStorage.removeItem('_active');
            this.storage.destroy(function() {
                if (typeof callback === 'function') {
                    callback();
                } else {
                    app.reload();
                }
            }, function(error) {
                console.error('USER LOGOUT ERROR:', error);
                app.reload();
            });
        },
        /**
         * @method loadStorage
         * @param {Function} callback
         */
        loadStorage: function(callback) {
            this.storage.open(this.getDatabaseName(), 1, {
                decomps: {keyPath: 'writing'},
                items: {keyPath: 'id', index: [{name: 'next'}]},
                reviews: {keyPath: 'id'},
                sentences: {keyPath: 'id'},
                stats: {keyPath: 'date'},
                strokes: {keyPath: 'rune'},
                vocablists: {keyPath: 'id'},
                vocabs: {keyPath: 'id'}
            }, function() {
                callback();
            }, function(error) {
                callback(error);
            });
        }
    });

    return User;

});