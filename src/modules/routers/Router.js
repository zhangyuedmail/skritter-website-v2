/**
 * @module Application
 * @submodule Routers
 */
define([
    'core/modules/GelatoRouter',
    'modules/pages/Dashboard',
    'modules/pages/Lists',
    'modules/pages/Login',
    'modules/pages/Home',
    'modules/pages/Scratchpad',
    'modules/pages/Stats',
    'modules/pages/Study',
    'modules/pages/Words'
], function(
    GelatoRouter,
    PageDashboard,
    PageLists,
    PageLogin,
    PageHome,
    PageScratchpad,
    PageStats,
    PageStudy,
    PageWords
) {

    /**
     * @class Router
     * @extends GelatoRouter
     */
    var Router = GelatoRouter.extend({
        /**
         * @property routes
         * @type Object
         */
        routes: {
            'lists': 'showLists',
            'login': 'showLogin',
            'logout': 'handleLogout',
            'scratchpad': 'showScratchpad',
            'scratchpad/:writing': 'showScratchpad',
            'stats': 'showStats',
            'study': 'showStudy',
            'words': 'showWords',
            '*route': 'showDefault'
        },
        /**
         * @method logout
         */
        handleLogout: function() {
            if (app.user.isAuthenticated()) {
                app.user.logout();
            } else {
                this.showDefault();
            }
        },
        /**
         * @method showDefault
         */
        showDefault: function() {
            this.navigate('');
            if (app.user.isAuthenticated()) {
                this.activePage = new PageDashboard();
            } else {
                this.activePage = new PageHome();
            }
            this.activePage.render();
        },
        /**
         * @method showLists
         */
        showLists: function() {
            this.activePage = new PageLists();
            this.activePage.render();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.activePage = new PageLogin();
            this.activePage.render();
        },
        /**
         * @method showScratchpad
         * @param {String} [writing]
         */
        showScratchpad: function(writing) {
            this.activePage = new PageScratchpad();
            this.activePage.load(writing).render();
        },
        /**
         * @method showStats
         */
        showStats: function() {
            this.activePage = new PageStats();
            this.activePage.render();
        },
        /**
         * @method showStudy
         */
        showStudy: function() {
            this.activePage = new PageStudy();
            this.activePage.render();
        },
        /**
         * @method showWords
         */
        showWords: function() {
            this.activePage = new PageWords();
            this.activePage.render();
        }
    });

    return Router;

});