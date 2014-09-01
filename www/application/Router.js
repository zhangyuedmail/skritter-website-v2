/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'pages/Home',
    'pages/Landing'
], function(BaseRouter, PageHome, PageLanding) {
    /**
     * @class Router
     * @extends BaseRouter
     */
    var Router = BaseRouter.extend({
        /**
         * @property routes
         * @type Object
         */
        routes: {
            '': 'showHome',
            '*route': 'defaultRoute'
        },
        /**
         * @method defaultRoute
         */
        defaultRoute: function() {
            this.navigate('', {replace: true, trigger: true});
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (app.user.isAuthenticated()) {
                this.currentPage = new PageHome();
                this.currentPage.render();
            } else {
                this.showLanding();
            }
        },
        /**
         * @method showLanding
         */
        showLanding: function() {
            this.currentPage = new PageLanding();
            this.currentPage.render();
        }
    });

    return Router;
});
