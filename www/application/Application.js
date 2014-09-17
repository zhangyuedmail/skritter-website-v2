/**
 * @module Application
 */
define([
    'framework/BaseApplication',
    'require.i18n!locale/nls/strings',
    'application/Functions',
    'application/Router',
    'components/Dialogs',
    'components/Sidebars',
    'models/Analytics',
    'models/Api',
    'models/Assets',
    'models/User',
    'storage/IndexedDBAdapter'
], function(BaseApplication, Strings,
            Functions, Router, Dialogs, Sidebars, Analytics, Api, Assets, User, IndexedDBAdapter) {
    /**
     * @class Application
     * @extends BaseApplication
     */
    var Application = BaseApplication.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseApplication.prototype.initialize.call(this);
            this.api = new Api();
            this.assets = new Assets();
            this.fn = Functions;
            this.router = new Router();
            this.storage = new IndexedDBAdapter();
            this.strings = Strings;
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            languageCode: '@@languageCode',
            timestamp: parseInt('@@timestamp', 10),
            version: '@@version',
            versionCode: '@@versionCode'
        },
        /**
         * @method start
         */
        start: function() {
            this.analytics = new Analytics();
            this.dialogs = new Dialogs();
            this.sidebars = new Sidebars();
            this.user = new User();
            this.user.load(function() {
                Backbone.history.start({
                    pushState: app.isLocalhost() ? false : true,
                    root: app.isLocalhost() ? '/skritter-html5/www/' : '/'
                });
            });
        }
    });

    return Application;
});