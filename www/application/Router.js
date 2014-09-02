/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'pages/Home',
    'pages/Landing',
    'pages/Login'
], function(BaseRouter, PageHome, PageLanding, PageLogin) {
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
            'login': 'showLogin',
            'logout': 'handleLogout',
            '*route': 'defaultRoute'
        },
        /**
         * @method defaultRoute
         */
        defaultRoute: function() {
            this.navigate('', {replace: true, trigger: true});
        },
        /**
         * @method handleLogout
         */
        handleLogout: function() {
            app.user.logout();
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
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.currentPage = new PageLogin();
            this.currentPage.render();
        }
    });

    return Router;
});
