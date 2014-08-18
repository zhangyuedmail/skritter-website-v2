/**
 * @module Application
 */
define([
    "framework/GelatoRouter",
    "app/views/admin/Stroke",
    "app/views/About",
    "app/views/Dashboard",
    "app/views/Home",
    "app/views/Login",
    "app/views/Team"
], function(GelatoRouter, AdminStrokeView, AboutView, DashboardView, HomeView, LoginView, TeamView) {
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
            "dashboard": "showDashboard",
            "login": "showLogin",
            "team": "showTeam",
            "admin/stroke": "showAdminStroke",
            "admin/stroke/:strokeId": "showAdminStroke",
            "admin/stroke/:strokeId/:paramIndex": "showAdminStroke",
            "*route": "defaultRoute"
        },
        /**
         * @method defaultRoute
         */
        defaultRoute: function() {
            this.navigate("", {replace: true, trigger: true});
        },
        /**
         * @method showAdminStroke
         * @param {Number} strokeId
         */
        showAdminStroke: function(strokeId, paramIndex) {
            this.currentView = new AdminStrokeView();
            this.currentView.set(strokeId, paramIndex);
            this.currentView.render();
        },
        /**
         * @method showAbout
         */
        showAbout: function() {
            this.currentView = new AboutView();
            this.currentView.render();
        },
        /**
         * @method showDashboard
         */
        showDashboard: function() {
            this.currentView = new DashboardView();
            this.currentView.render();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (app.user.isLoggedIn()) {
                this.showDashboard();
            } else {
                if (gelato.isNative()) {
                    this.showLogin();
                } else {
                    this.currentView = new HomeView();
                }
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
