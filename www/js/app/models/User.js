/**
 * @module Application
 */
define([
    "framework/GelatoModel",
    "app/models/user/Api",
    "app/models/user/Data",
    "app/models/user/Settings"
], function(GelatoModel, UserApi, UserData, UserSettings) {
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
                delete data.statusCode;
                if (status === 200) {
                    app.user.set("id", data.user_id);
                    app.user.api.set(data);
                    async.series([
                        async.apply(app.user.settings.sync)
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
            localStorage.removeItem(this.id + "-api");
            localStorage.removeItem(this.id + "-settings");
            localStorage.removeItem("_active");
            location.reload(true);
        }
    });
});
