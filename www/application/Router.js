/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'routers/RouterGettingStarted',
    'routers/RouterLearningCenter',
    'pages/Account',
    'pages/Dashboard',
    'pages/Landing',
    'pages/Lists',
    'pages/Login',
    'pages/Settings',
    'pages/Study',
    'pages/Tests'
], function(BaseRouter, RouterGettingStarted, RouterLearningCenter,
            PageAccount, PageDashboard, PageLanding, PageLists, PageLogin, PageSettings, PageStudy, PageTests) {
    /**
     * @class Router
     * @extends BaseRouter
     */
    var Router = BaseRouter.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.gettingStarted = new RouterGettingStarted();
            this.learningCenter = new RouterLearningCenter();
            document.addEventListener('backbutton', _.bind(this.handleBackButtonPressed, this), false);
            document.addEventListener('menubutton', _.bind(this.handleMenuButtonPressed, this), false);
        },
        /**
         * @property routes
         * @type Object
         */
        routes: {
            '': 'showHome',
            'account': 'showAccount',
            'lists': 'showLists',
            'lists/:listId': 'showList',
            'lists/sort/:sort': 'showLists',
            'login': 'showLogin',
            'logout': 'handleLogout',
            'settings': 'showSettings',
            'study': 'showStudy',
            'tests': 'showTests',
            '*route': 'defaultRoute'
        },
        /**
         * @method handleBackButtonPressed
         */
        handleBackButtonPressed: function() {
            if (app.sidebars.isExpanded()) {
                app.sidebars.hide();
            } else if (Backbone.history.fragment === '') {
                app.dialogs.show('exit');
                app.dialogs.element('.exit').one('vclick', function() {
                    navigator.app.exitApp();
                });
            } else {
                this.back();
            }
        },
        /**
         * @method handleLogout
         */
        handleLogout: function() {
            app.user.logout(true);
        },
        /**
         * @method handleMenuButtonPressed
         */
        handleMenuButtonPressed: function() {
            if (app.sidebars && app.user.isAuthenticated()) {
                app.sidebars.select('menu').toggle();
            }
        },
        /**
         * @method showAccount
         */
        showAccount: function() {
            this.currentPage = new PageAccount();
            this.currentPage.render();
        },
        /**
         * @method showDashboard
         */
        showDashboard: function() {
            this.currentPage = new PageDashboard();
            this.currentPage.render();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (app.user.isAuthenticated()) {
                this.showDashboard();
            } else {
                this.showLanding();
            }
        },
        /**
         * @method showLanding
         */
        showLanding: function() {
            this.currentPage = new PageLanding();
            this.currentPage.render();
        },
        /**
         * @method showList
         * @param {String} listId
         */
        showList: function(listId) {
            this.currentPage = new PageLists();
            this.currentPage.set(listId).render();
        },
        /**
         * @method showLists
         * @param {String} [sort]
         */
        showLists: function(sort) {
            this.currentPage = new PageLists();
            this.currentPage.set(sort).render();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            this.currentPage = new PageLogin();
            this.currentPage.render();
        },
        /**
         * @method showSettings
         */
        showSettings: function() {
            this.currentPage = new PageSettings();
            this.currentPage.render();
        },
        /**
         * @method showStudy
         */
        showStudy: function() {
            this.currentPage = new PageStudy();
            this.currentPage.render();
        },
        /**
         * @method showTests
         */
        showTests: function() {
            this.currentPage = new PageTests();
            this.currentPage.render();
        }
    });

    return Router;
});
