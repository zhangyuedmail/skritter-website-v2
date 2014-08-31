/**
 * @module Application
 */
define([
    'framework/BaseApplication',
    'require.i18n!locale/nls/strings',
    'application/Router',
    'application/components/Sidebars'
], function(BaseApplication, Strings, Router, Sidebars) {
    /**
     * @class Application
     * @extends BaseApplication
     */
    var Application = BaseApplication.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.router = new Router();
            this.strings = Strings;
        },
        /**
         * @method start
         */
        start: function() {
            this.sidebars = new Sidebars();
            Backbone.history.start();
        }
    });

    return Application;
});