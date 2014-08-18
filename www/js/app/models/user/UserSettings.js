/**
 * @module Application
 */
define([
    "framework/GelatoModel"
], function(GelatoModel) {
    return GelatoModel.extend({
        /**
         * @class UserSettings
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.on("change", this.cache);
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(app.user.id + "-settings", JSON.stringify(this.toJSON()));
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            filterChineseParts: ["defn", "rdng", "rune", "tone"],
            filterJapaneseParts: ["defn", "rdng", "rune"]
        },
        /**
         * @method getActiveParts
         * @returns {Array}
         */
        getActiveParts: function() {
            if (app.user.isChinese()) {
                return _.intersection(this.get("filterChineseParts"), this.getEnabledParts()) ;
            }
            return _.intersection(this.get("filterJapaneseParts"), this.getEnabledParts());
        },
        /**
         * @method getActiveStyles
         * @returns {Array}
         */
        getActiveStyles: function() {
            if (app.user.isJapanese()) {
                return ["both"];
            } else if (app.user.isChinese() && this.get("reviewSimplified") && this.get("reviewTraditional")) {
                return ["both", "simp", "trad"];
            } else if (app.user.isChinese() && this.get("reviewSimplified") && !this.get("reviewTraditional")) {
                return ["both", "simp"];
            } else {
                return ["both", "trad"];
            }
        },
        /**
         * @method getEnabledParts
         * @returns {Array}
         */
        getEnabledParts: function() {
            return app.user.isChinese() ? this.get('chineseStudyParts') : this.get('japaneseStudyParts');
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            var self = this;
            app.api.getUsers(app.user.id, function(data, status) {
                if (status === 200) {
                    self.set(data);
                    callback();
                } else {
                    callback(data, status);
                }
            });
        }
    });
});
