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
         * @constructor
         */
        initialize: function() {
            this.on('change', this.cache);
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(app.user.id + '-settings', JSON.stringify(this.toJSON()));
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune']
        }
    });

    return UserSettings;
});