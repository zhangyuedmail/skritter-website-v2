/**
 * @module Application
 */
define([
    'framework/BaseApplication',
    'require.i18n!locale/nls/strings',
    'application/Router'
], function(BaseApplication, Strings, Router) {
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
            this.strings = Strings;
            Backbone.history.start();
        }
    });

    return Application;
});