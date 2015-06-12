/**
 * @module Application
 * @submodule Routers
 */
define([
    'core/modules/GelatoRouter',
    'modules/pages/dashboard/DashboardPage',
    'modules/pages/lists/browse/BrowseListsPage',
    'modules/pages/lists/create/CreateListPage',
    'modules/pages/lists/custom/CustomListsPage',
    'modules/pages/lists/queue/QueueListsPage',
    'modules/pages/lists/single/SingleListPage',
    'modules/pages/lists/single-section/SingleListSectionPage',
    'modules/pages/marketing/about/AboutPage',
    'modules/pages/marketing/contact/ContactPage',
    'modules/pages/marketing/features/FeaturesPage',
    'modules/pages/marketing/institutions/InstitutionsPage',
    'modules/pages/marketing/landing/LandingPage',
    'modules/pages/marketing/legal/LegalPage',
    'modules/pages/marketing/login/LoginPage',
    'modules/pages/marketing/password-reset/PasswordResetPage',
    'modules/pages/marketing/pricing/PricingPage',
    'modules/pages/marketing/signup/SignupPage',
    'modules/pages/settings/general/GeneralSettingsPage',
    'modules/pages/settings/study/StudySettingsPage',
    'modules/pages/stats/summary/SummaryStatsPage',
    'modules/pages/stats/timeline/TimelineStatsPage',
    'modules/pages/study/StudyPage',
    'modules/pages/words/WordsPage',
    'modules/pages/Demo',
    'modules/pages/Scratchpad',
    'modules/pages/Tutorial'
], function(
    GelatoRouter,
    DashboardPage,
    BrowseListsPage,
    CreateListPage,
    CustomListsPage,
    QueueListsPage,
    SingleListPage,
    SingleListSectionPage,
    AboutPage,
    ContactPage,
    FeaturesPage,
    InstitutionsPage,
    LandingPage,
    LegalPage,
    LoginPage,
    PasswordResetPage,
    PricingPage,
    SignupPage,
    GeneralSettingsPage,
    StudySettingsPage,
    SummaryStatsPage,
    TimelineStatsPage,
    StudyPage,
    WordsPage,
    PageDemo,
    PageScratchpad,
    PageTutorial
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
            'demo/:language': 'showDemo',
            'features': 'showFeatures',
            'institutions': 'showInstitutions',
            'legal': 'showLegal',
            'lists': 'showQueueLists',
            'lists/browse': 'showBrowseLists',
            'lists/browse/:listId': 'showSingleList',
            'lists/browse/:listId/:sectionId': 'showSingleListSection',
            'lists/create': 'showCreateList',
            'lists/my-lists': 'showCustomLists',
            'lists/queue': 'showQueueLists',
            'login': 'showLogin',
            'password-reset': 'showPasswordReset',
            'pricing': 'showPricing',
            'scratchpad': 'showScratchpad',
            'scratchpad/:writing': 'showScratchpad',
            'settings': 'showGeneralSettings',
            'settings/general': 'showGeneralSettings',
            'settings/study': 'showStudySettings',
            'signup': 'showSignup',
            'signup/:price': 'showSignup',
            'stats': 'showSummaryStats',
            'stats/summary': 'showSummaryStats',
            'stats/timeline': 'showTimelineStats',
            'study': 'showStudy',
            'study/:listId': 'showStudy',
            'study/:listId/:sectionId': 'showStudy',
            'tutorial/:module': 'showTutorial',
            'tutorial/:module/:index': 'showTutorial',
            'words': 'showWords',
            'words/:vocabId': 'showWords',
            '*route': 'showDefault'
        },
        /**
         * @method showAbout
         */
        showAbout: function() {
            this.page = new AboutPage();
            this.page.render();
        },
        /**
         * @method showBrowseLists
         */
        showBrowseLists: function() {
            this.page = new BrowseListsPage();
            this.page.render().load();
        },
        /**
         * @method showContact
         */
        showContact: function() {
            this.page = new ContactPage();
            this.page.render();
        },
        /**
         * @method showCreateList
         */
        showCreateList: function() {
            this.page = new CreateListPage();
            this.page.render();
        },
        /**
         * @method showCustomLists
         */
        showCustomLists: function() {
            this.page = new CustomListsPage();
            this.page.render().load();
        },
        /**
         * @method showDashboard
         */
        showDashboard: function() {
            if (app.user.isLoggedIn()) {
                this.page = new DashboardPage();
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
                this.showLanding();
            }
        },
        /**
         * @method showDemo
         * @param {String} [language]
         */
        showDemo: function(language) {
            this.page = new PageDemo();
            this.page.render().load(language);
        },
        /**
         * @method showFeatures
         */
        showFeatures: function() {
            this.page = new FeaturesPage();
            this.page.render();
        },
        /**
         * @method showGeneralSettings
         */
        showGeneralSettings: function() {
            this.navigate('settings/general', {trigger: false});
            this.page = new GeneralSettingsPage();
            this.page.render();
        },
        /**
         * @method showLanding
         */
        showLanding: function() {
            this.page = new LandingPage();
            this.page.render();
        },
        /**
         * @method showInstitutions
         */
        showInstitutions: function() {
            this.page = new InstitutionsPage();
            this.page.render();
        },
        /**
         * @method showLegal
         */
        showLegal: function() {
            this.page = new LegalPage();
            this.page.render();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.page = new LoginPage();
            this.page.render();
        },
        /**
         * @method showPasswordReset
         */
        showPasswordReset: function() {
            this.page = new PasswordResetPage();
            this.page.render();
        },
        /**
         * @method showPricing
         */
        showPricing: function() {
            this.page = new PricingPage();
            this.page.render();
        },
        /**
         * @method showQueueLists
         */
        showQueueLists: function() {
            this.navigate('lists/queue', {trigger: false});
            this.page = new QueueListsPage();
            this.page.render().load();
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
         * @param {String} [price]
         */
        showSignup: function(price) {
            this.page = new SignupPage();
            this.page.render().select(price);
        },
        /**
         * @method showSingleList
         * @param {String} listId
         */
        showSingleList: function(listId) {
            this.page = new SingleListPage();
            this.page.render().load(listId);
        },
        /**
         * @method showSingleListSection
         * @param {String} listId
         * @param {String} sectionId
         */
        showSingleListSection: function(listId, sectionId) {
            this.page = new SingleListSectionPage();
            this.page.render().load(listId, sectionId);
        },
        /**
         * @method showSummaryStats
         */
        showSummaryStats: function() {
            this.navigate('stats/summary', {trigger: false});
            this.page = new SummaryStatsPage();
            this.page.render();
        },
        /**
         * @method showStudy
         * @param {String} listId
         * @param {String} sectionId
         */
        showStudy: function(listId, sectionId) {
            this.page = new StudyPage();
            this.page.render().load(listId, sectionId);
        },
        /**
         * @method showStudySettings
         */
        showStudySettings: function() {
            this.page = new StudySettingsPage();
            this.page.render();
        },
        /**
         * @method showTimelineStats
         */
        showTimelineStats: function() {
            this.page = new TimelineStatsPage();
            this.page.render();
        },
        /**
         * @method showTutorial
         * @param {String} [module]
         * @param {String} [index]
         */
        showTutorial: function(module, index) {
            this.page = new PageTutorial();
            this.page.render().load(module, index);
        },
        /**
         * @method showWords
         * @param {String} vocabId
         */
        showWords: function(vocabId) {
            this.page = new WordsPage();
            this.page.render().load(vocabId);
        }
    });

    return Router;

});