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
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
        },
        /**
         * @property routes
         * @type Object
         */
        routes: {
            'dashboard': 'showDashboard',
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
         * @method showDashboard
         */
        showDashboard: function() {
            this.page = new PageDashboard({app: this.app});
            this.page.render();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (this.app.user.isAuthenticated()) {
                this.navigate('dashboard', {trigger: false});
                this.showDashboard();
            } else {
                this.navigate('', {trigger: false});
                this.page = new PageHome({app: this.app});
                this.page.render();
            }
        },
        /**
         * @method showList
         * @param {String} listId
         */
        showList: function(listId) {
            this.page = new PageList({app: this.app});
            this.page.render().load(listId);
        },
        /**
         * @method showListSection
         * @param {String} listId
         * @param {String} sectionId
         */
        showListSection: function(listId, sectionId) {
            this.page = new PageListSection({app: this.app});
            this.page.render().load(listId, sectionId);
        },
        /**
         * @method showListBrowse
         */
        showListBrowse: function() {
            this.page = new PageListBrowse({app: this.app});
            this.page.render();
        },
        /**
         * @method showListCreate
         */
        showListCreate: function() {
            this.page = new PageListCreate({app: this.app});
            this.page.render();
        },
        /**
         * @method showListQueue
         */
        showListQueue: function() {
            this.page = new PageListQueue({app: this.app});
            this.page.render();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.page = new PageLogin({app: this.app});
            this.page.render();
        },
        /**
         * @method showScratchpad
         * @param {String} [writing]
         */
        showScratchpad: function(writing) {
            this.page = new PageScratchpad({app: this.app});
            this.page.render().load(writing);
        },
        /**
         * @method showStatsSummary
         */
        showStatsSummary: function() {
            this.page = new PageStatsSummary({app: this.app});
            this.page.render();
        },
        /**
         * @method showStatsTimeline
         */
        showStatsTimeline: function() {
            this.page = new PageStatsTimeline({app: this.app});
            this.page.render();
        },
        /**
         * @method showStudy
         * @param {String} listId
         * @param {String} sectionId
         */
        showStudy: function(listId, sectionId) {
            this.page = new PageStudy({app: this.app});
            this.page.render().load(listId, sectionId);
        },
        /**
         * @method showWords
         */
        showWords: function() {
            this.page = new PageWords({app: this.app});
            this.page.render();
        }
    });

    return Router;

});