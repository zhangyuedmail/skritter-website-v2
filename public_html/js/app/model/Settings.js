define([
    'require.locale!../../../locale/nls/strings'
], function(locale) {
    /**
     * @class Settings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            skritter.nls = locale;
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
        }
    });

    return Settings;
});