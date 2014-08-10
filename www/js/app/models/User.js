/**
 * @module Application
 */
define([
    "framework/GelatoModel",
    "app/models/user/Data",
    "app/models/user/Settings",
    "app/models/user/Subscription"
], function(GelatoModel, UserData, UserSettings, UserSubscription) {
    return GelatoModel.extend({
        /**
         * @class User
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.data = new UserData();
            this.settings = new UserSettings();
            this.subscription = new UserSubscription();
            if (localStorage.getItem("_active")) {
                this.set("id", localStorage.getItem("_active"));
                if (localStorage.getItem(this.id + "-data")) {
                    this.data.set(JSON.parse(localStorage.getItem(this.id + "-data")), {silent: true});
                }
                if (localStorage.getItem(this.id + "-settings")) {
                    this.settings.set(JSON.parse(localStorage.getItem(this.id + "-settings")), {silent: true});
                }
                if (localStorage.getItem(this.id + "-subscription")) {
                    this.subscription.set(JSON.parse(localStorage.getItem(this.id + "-subscription")), {silent: true});
                }
            }
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {"id": "guest"},
        /**
         * @method isLoggedIn
         * @returns {Boolean}
         */
        isLoggedIn: function() {
            return this.data.get("access_token") ? true : false;
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
        logout: function() {
            app.dialog.show("logout");
            app.dialog.element("button.logout").on("vclick", function() {
                app.storage.destroy(function() {
                    localStorage.removeItem(app.user.id + "-data");
                    localStorage.removeItem(app.user.id + "-settings");
                    localStorage.removeItem(app.user.id + "-subscription");
                    localStorage.removeItem("_active");
                    location.reload(true);
                });
            });
        }
    });
});
