/**
 * @module Application
 * @submodule Routers
 */
define([
    'core/modules/GelatoRouter',
    'modules/pages/Dashboard',
    'modules/pages/ListBrowse',
    'modules/pages/ListStudying',
    'modules/pages/Login',
    'modules/pages/Home',
    'modules/pages/Scratchpad',
    'modules/pages/Stats',
    'modules/pages/Study',
    'modules/pages/Words'
], function(
    GelatoRouter,
    PageDashboard,
    PageListBrowse,
    PageListStudying,
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
            'lists/browse': 'showListBrowse',
            'lists/queue': 'showListStudying',
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
         * @method showListBrowse
         */
        showListBrowse: function() {
            this.activePage = new PageListBrowse();
            this.activePage.render().load();
        },
        /**
         * @method showListStudying
         */
        showListStudying: function() {
            this.activePage = new PageListStudying();
            this.activePage.render().load();
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