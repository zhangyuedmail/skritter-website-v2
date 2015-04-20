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
    'modules/pages/Stats',
    'modules/pages/Study',
    'modules/pages/Word',
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
    PageStats,
    PageStudy,
    PageWord,
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
            'stats': 'showStats',
            'stats/:type': 'showStats',
            'study': 'showStudy',
            'study/:listId': 'showStudy',
            'study/:listId/:sectionId': 'showStudy',
            'words/:writing': 'showWord',
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
         * @method showStats
         * @param {String} [type]
         */
        showStats: function(type) {
            this.page = new PageStats();
            this.page.render().load(type);
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
         * @method showWord
         * @param {String} writing
         */
        showWord: function(writing) {
            this.page = new PageWord();
            this.page.render().load(writing);
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