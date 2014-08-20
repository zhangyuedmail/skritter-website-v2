/**
 * @module Application
 */
define([
    "framework/GelatoRouter",
    "app/views/admin/CharacterEditor",
    "app/views/admin/StrokeEditor",
    "app/views/About",
    "app/views/Dashboard",
    "app/views/Home",
    "app/views/Login",
    "app/views/Team"
], function(GelatoRouter, CharacterEditorView, StrokeEditorView, AboutView, DashboardView, HomeView, LoginView, TeamView) {
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
            "admin/character/:writing": "showCharacterEditor",
            "admin/stroke": "showStrokeEditor",
            "admin/stroke/:strokeId": "showStrokeEditor",
            "admin/stroke/:strokeId/:paramIndex": "showStrokeEditor",
            "dashboard": "showDashboard",
            "login": "showLogin",
            "team": "showTeam",
            "*route": "defaultRoute"
        },
        /**
         * @method defaultRoute
         */
        defaultRoute: function() {
            this.navigate("", {replace: true, trigger: true});
        },
        /**
         * @method showAbout
         */
        showAbout: function() {
            this.currentView = new AboutView();
            this.currentView.render();
        },
        /**
         * @method showCharacterEditor
         * @param {String} writing
         */
        showCharacterEditor: function(writing) {
            this.currentView = new CharacterEditorView();
            this.currentView.set(writing);
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
         * @method showStrokeEditor
         * @param {String} strokeId
         * @param {String} paramIndex
         */
        showStrokeEditor: function(strokeId, paramIndex) {
            this.currentView = new StrokeEditorView();
            this.currentView.set(strokeId, paramIndex);
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
