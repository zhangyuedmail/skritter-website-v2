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
         * @method start
         */
        start: function() {
            this.router = new Router();
            this.sidebars = new Sidebars();
            this.strings = Strings;
            Backbone.history.start();
        }
    });

    return Application;
});