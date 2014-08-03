/**
 * @module Application
 */
define([
    "framework/GelatoRouter",
    "app/views/Home",
    "app/views/Login"
], function(GelatoRouter, HomeView, LoginView) {
    /**
     * @class Router
     * @extend GelatoRouter
     */
    return GelatoRouter.extend({
        /**
         * @property routes
         * @type Object
         */
        routes: {
            "": "showHome",
            "login": "showLogin"
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (gelato.isNative()) {
                this.showLogin();
            } else {
                this.currentView = new HomeView();
            }
            this.currentView.render();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.currentView = new LoginView();
            this.currentView.render();
        }
    });
});
