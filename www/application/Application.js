/**
 * @module Application
 */
define([
    'framework/BaseApplication',
    'require.i18n!locale/nls/strings',
    'application/Router',
    'components/Sidebars',
    'models/Assets',
    'models/User'
], function(BaseApplication, Strings, Router, Sidebars, Assets, User) {
    /**
     * @class Application
     * @extends BaseApplication
     */
    var Application = BaseApplication.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.assets = new Assets();
            this.router = new Router();
            this.strings = Strings;
            this.user = new User();
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