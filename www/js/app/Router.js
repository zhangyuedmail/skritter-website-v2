/**
 * @module Application
 */
define([
    "framework/GelatoRouter",
    "app/views/About",
    "app/views/Home",
    "app/views/Login",
    "app/views/Team"
], function(GelatoRouter, AboutView, HomeView, LoginView, TeamView) {
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
            "about": "showAbout",
            "login": "showLogin",
            "team": "showTeam"
        },
        /**
         * @method showAbout
         */
        showAbout: function() {
            this.currentView = new AboutView();
            this.currentView.render();
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
        },
        /**
         * @method showTeam
         */
        showTeam: function() {
            this.currentView = new TeamView();
            this.currentView.render();
        }
    });
});
