/**
 * @module Application
 * @submodule Routers
 */
define([
    'core/modules/GelatoRouter',
    'modules/pages/About',
    'modules/pages/Contact',
    'modules/pages/Dashboard',
    'modules/pages/Features',
    'modules/pages/GeneralSettings',
    'modules/pages/Home',
    'modules/pages/Institutions',
    'modules/pages/Legal',
    'modules/pages/List',
    'modules/pages/ListBrowse',
    'modules/pages/ListCreate',
    'modules/pages/ListQueue',
    'modules/pages/ListSection',
    'modules/pages/Login',
    'modules/pages/Pricing',
    'modules/pages/Scratchpad',
    'modules/pages/Signup',
    'modules/pages/StatsSummary',
    'modules/pages/StatsTimeline',
    'modules/pages/Study',
    'modules/pages/StudySettings',
    'modules/pages/Tutorial',
    'modules/pages/Words'
], function(
    GelatoRouter,
    PageAbout,
    PageContact,
    PageDashboard,
    PageFeatures,
    PageGeneralSettings,
    PageHome,
    PageInstitutions,
    PageLegal,
    PageList,
    PageListBrowse,
    PageListCreate,
    PageListQueue,
    PageListSection,
    PageLogin,
    PagePricing,
    PageScratchpad,
    PageSignup,
    PageStatsSummary,
    PageStatsTimeline,
    PageStudy,
    PageStudySettings,
    PageTutorial,
    PageWords
) {

    /**
     * @class Router
     * @extends GelatoRouter
     */
    var Router = GelatoRouter.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property routes
         * @type Object
         */
        routes: {
            'about': 'showAbout',
            'contact': 'showContact',
            'dashboard': 'showDashboard',
            'features': 'showFeatures',
            'institutions': 'showInstitutions',
            'legal': 'showLegal',
            'lists': 'showListQueue',
            'lists/browse': 'showListBrowse',
            'lists/browse/:listId': 'showList',
            'lists/browse/:listId/:sectionId': 'showListSection',
            'lists/create': 'showListCreate',
            'lists/queue': 'showListQueue',
            'login': 'showLogin',
            'pricing': 'showPricing',
            'scratchpad': 'showScratchpad',
            'scratchpad/:writing': 'showScratchpad',
            'settings': 'showGeneralSettings',
            'settings/general': 'showGeneralSettings',
            'settings/study': 'showStudySettings',
            'signup': 'showSignup',
            'stats': 'showStatsSummary',
            'stats/summary': 'showStatsSummary',
            'stats/timeline': 'showStatsTimeline',
            'study': 'showStudy',
            'study/:listId': 'showStudy',
            'study/:listId/:sectionId': 'showStudy',
            'tutorial': 'showTutorial',
            'tutorial/:language': 'showTutorial',
            'tutorial/:language/:page': 'showTutorial',
            'words': 'showWords',
            '*route': 'showDefault'
        },
        /**
         * @method showAbout
         */
        showAbout: function() {
            this.page = new PageAbout();
            this.page.render();
        },
        /**
         * @method showContact
         */
        showContact: function() {
            this.page = new PageContact();
            this.page.render();
        },
        /**
         * @method showDashboard
         */
        showDashboard: function() {
            if (app.user.isLoggedIn()) {
                this.page = new PageDashboard();
                this.page.render();
            } else {
                this.showDefault();
            }
        },
        /**
         * @method showDefault
         */
        showDefault: function() {
            if (app.user.isLoggedIn()) {
                this.navigate('dashboard', {trigger: false});
                this.showDashboard();
            } else {
                this.navigate('', {trigger: false});
                this.showHome();
            }
        },
        /**
         * @method showFeatures
         */
        showFeatures: function() {
            this.page = new PageFeatures();
            this.page.render();
        },
        /**
         * @method showGeneralSettings
         */
        showGeneralSettings: function() {
            this.navigate('settings/general', {trigger: false});
            this.page = new PageGeneralSettings();
            this.page.render();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            this.page = new PageHome();
            this.page.render();
        },
        /**
         * @method showInstitutions
         */
        showInstitutions: function() {
            this.page = new PageInstitutions();
            this.page.render();
        },
        /**
         * @method showLegal
         */
        showLegal: function() {
            this.page = new PageLegal();
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
            this.page.render();
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
            this.navigate('lists/queue', {trigger: false});
            this.page = new PageListQueue();
            this.page.render();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.page = new PageLogin();
            this.page.render();
        },
        /**
         * @method showPricing
         */
        showPricing: function() {
            this.page = new PagePricing();
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
         * @method showSignup
         */
        showSignup: function() {
            this.page = new PageSignup();
            this.page.render();
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
         * @method showStudySettings
         */
        showStudySettings: function() {
            this.page = new PageStudySettings();
            this.page.render();
        },
        /**
         * @method showTutorial
         * @param {String} [language]
         * @param {String} [page]
         */
        showTutorial: function(language, page) {
            this.page = new PageTutorial();
            this.page.render().load(language, page);
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