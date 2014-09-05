/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class UserSettings
     * @extends BaseModel
     */
    var UserSettings = BaseModel.extend({
        /**
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.user = options.user;
            this.on('change', this.cache);
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-settings', JSON.stringify(this.toJSON()));
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune']
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            var self = this;
            app.api.getUsers(this.user.id, function(data, status) {
                if (status === 200) {
                    self.set(data);
                    callback();
                } else {
                    callback(data, status);
                }
            });
        }
    });

    return UserSettings;
});