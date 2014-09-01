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
            this.data = new UserData(this);
            this.schedule = new ScheduleItems();
            this.settings = new UserSettings(this);
            this.subscription = new UserSubscription(this);
            this.load();
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            id: 'guest',
            lang: '@@language'
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
                    callback('created user', self.id);
                    //callback();
                }
            });
        },
        /**
         * @method isAuthenticated
         * @returns {Boolean}
         */
        isAuthenticated: function() {
            return this.id !== 'guest';
        },
        /**
         * @method isGuest
         * @returns {Boolean}
         */
        isGuest: function() {
            return this.id === 'guest';
        },
        /**
         * @method load
         */
        load: function() {
            if (localStorage.getItem('_active')) {
                this.set('id', localStorage.getItem('_active'));
                if (localStorage.getItem(this.id + '-data')) {
                    this.data.set(JSON.parse(localStorage.getItem(this.id + '-data')));
                }
                if (localStorage.getItem(this.id + '-settings')) {
                    this.settings.set(JSON.parse(localStorage.getItem(this.id + '-settings')));
                }
                if (localStorage.getItem(this.id + '-subscription')) {
                    this.subscription.set(JSON.parse(localStorage.getItem(this.id + '-subscription')));
                }
            }
        },
        /**
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        login: function(username, password, callback) {
            var self = this;
            app.api.authenticateUser(username, password, function(data, status) {
                if (status === 200) {
                    self.set("id", data.user_id);
                    self.data.set(data);
                    async.parallel([
                        function(callback) {
                            self.settings.sync(callback);
                        },
                        function(callback) {
                            self.subscription.sync(callback);
                        }
                    ], function() {
                        localStorage.setItem("_active", data.user_id);
                        callback(data, status);
                    });
                } else {
                    callback(data, status);
                }
            });
        },
        /**
         * @method logout
         */
        logout: function() {}
    });

    return User;
});