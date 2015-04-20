/**
 * @module Application
 * @submodule Routers
 */
define([
    'core/modules/GelatoRouter',
    'modules/pages/Dashboard',
    'modules/pages/List',
    'modules/pages/ListBrowse',
    'modules/pages/ListCreate',
    'modules/pages/ListQueue',
    'modules/pages/ListSection',
    'modules/pages/Login',
    'modules/pages/Home',
    'modules/pages/Scratchpad',
    'modules/pages/StatsSummary',
    'modules/pages/StatsTimeline',
    'modules/pages/Study',
    'modules/pages/Words'
], function(
    GelatoRouter,
    PageDashboard,
    PageList,
    PageListBrowse,
    PageListCreate,
    PageListQueue,
    PageListSection,
    PageLogin,
    PageHome,
    PageScratchpad,
    PageStatsSummary,
    PageStatsTimeline,
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
            'lists': 'showListQueue',
            'lists/browse': 'showListBrowse',
            'lists/browse/:listId': 'showList',
            'lists/browse/:listId/:sectionId': 'showListSection',
            'lists/create': 'showListCreate',
            'lists/queue': 'showListQueue',
            'login': 'showLogin',
            'logout': 'handleLogout',
            'scratchpad': 'showScratchpad',
            'scratchpad/:writing': 'showScratchpad',
            'stats': 'showStatsSummary',
            'stats/summary': 'showStatsSummary',
            'stats/timeline': 'showStatsTimeline',
            'study': 'showStudy',
            'study/:listId': 'showStudy',
            'study/:listId/:sectionId': 'showStudy',
            'words': 'showWords',
            '*route': 'showHome'
        },
        /**
         * @method logout
         */
        handleLogout: function() {
            app.user.logout();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            this.page = new PageHome();
            this.page.render();
        },
        /**
         * @method showList
         * @param {String} listId
         */
        showList: function(listId) {
            this.page = new PageList();
            this.page.render().load(listId);
        },
        /**
         * @method showListSection
         * @param {String} listId
         * @param {String} sectionId
         */
        showListSection: function(listId, sectionId) {
            this.page = new PageListSection();
            this.page.render().load(listId, sectionId);
        },
        /**
         * @method showListBrowse
         */
        showListBrowse: function() {
            this.page = new PageListBrowse();
            this.page.render().load();
        },
        /**
         * @method showListCreate
         */
        showListCreate: function() {
            this.page = new PageListCreate();
            this.page.render();
        },
        /**
         * @method showListQueue
         */
        showListQueue: function() {
            this.page = new PageListQueue();
            this.page.render().load();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.page = new PageLogin();
            this.page.render();
        },
        /**
         * @method showScratchpad
         * @param {String} [writing]
         */
        showScratchpad: function(writing) {
            this.page = new PageScratchpad();
            this.page.render().load(writing);
        },
        /**
         * @method showStatsSummary
         */
        showStatsSummary: function() {
            this.page = new PageStatsSummary();
            this.page.render();
        },
        /**
         * @method showStatsTimeline
         */
        showStatsTimeline: function() {
            this.page = new PageStatsTimeline();
            this.page.render();
        },
        /**
         * @method showStudy
         * @param {String} listId
         * @param {String} sectionId
         */
        showStudy: function(listId, sectionId) {
            this.page = new PageStudy();
            this.page.render().load(listId, sectionId);
        },
        /**
         * @method showWords
         */
        showWords: function() {
            this.page = new PageWords();
            this.page.render();
        }
    });

    return Router;

});