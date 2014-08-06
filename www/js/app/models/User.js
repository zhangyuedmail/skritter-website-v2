/**
 * @module Application
 */
define([
    "framework/GelatoModel",
    "app/models/user/Api",
    "app/models/user/Data",
    "app/models/user/Settings",
    "app/models/user/Subscription"
], function(GelatoModel, UserApi, UserData, UserSettings, UserSubscription) {
    return GelatoModel.extend({
        /**
         * @class User
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.api = new UserApi();
            this.data = new UserData();
            this.settings = new UserSettings();
            this.subscription = new UserSubscription();
            if (localStorage.getItem("_active")) {
                this.set("id", localStorage.getItem("_active"));
                if (localStorage.getItem(this.id + "-api")) {
                    this.api.set(JSON.parse(localStorage.getItem(this.id + "-api")), {silent: true});
                }
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
            return this.api.get("access_token") ? true : false;
        },
        /**
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        login: function(username, password, callback) {
            app.user.api.authenticateUser(username, password, function(data, status) {
                if (status === 200) {
                    app.user.set("id", data.user_id);
                    async.series([
                        async.apply(app.user.settings.sync),
                        async.apply(app.user.subscription.sync)
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
                localStorage.removeItem(app.user.id + "-api");
                localStorage.removeItem(app.user.id + "-settings");
                localStorage.removeItem(app.user.id + "-subscription");
                localStorage.removeItem("_active");
                location.reload(true);
            });
        }
    });
});
