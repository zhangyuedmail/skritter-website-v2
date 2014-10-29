/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'routers/RouterGettingStarted',
    'routers/RouterLearningCenter',
    'pages/Account',
    'pages/Banned',
    'pages/Dashboard',
    'pages/Filters',
    'pages/Landing',
    'pages/List',
    'pages/ListSection',
    'pages/Lists',
    'pages/Login',
    'pages/Scratchpad',
    'pages/Settings',
    'pages/Starred',
    'pages/Study',
    'pages/Tests',
    'pages/Words'
], function(BaseRouter, RouterGettingStarted, RouterLearningCenter,
            PageAccount, PageBanned, PageDashboard, PageFilters, PageLanding, PageList, PageListSection, PageLists,
            PageLogin, PageScratchpad, PageSettings, PageStarred, PageStudy, PageTests, PageWords) {
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
            'banned': 'showBanned',
            'filters': 'showFilters',
            'list': 'showLists',
            'list/:listId': 'showList',
            'list/sort/:sort': 'showLists',
            'list/:listId/:sectionId': 'showListSection',
            'login': 'showLogin',
            'logout': 'handleLogout',
            'scratchpad/:writings': 'showScratchpad',
            'settings': 'showSettings',
            'starred': 'showStarred',
            'study': 'showStudy',
            'tests': 'showTests',
            'words': 'showWords',
            'words/:filter': 'showWords',
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
                app.dialogs.element('.loader-image').hide();
                app.dialogs.element('.exit').one('vclick', function() {
                    app.dialogs.element('button').hide();
                    app.dialogs.element('.modal-header').hide();
                    app.dialogs.element('.loader-image').show();
                    if (app.user.isAuthenticated()) {
                        app.analytics.trackUserEvent('exiting application');
                        app.user.data.sync(0, function() {
                            navigator.app.exitApp();
                        }, function() {
                            navigator.app.exitApp();
                        });
                    } else {
                        navigator.app.exitApp();
                    }
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
         * @method showBanned
         */
        showBanned: function() {
            this.currentPage = new PageBanned();
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
         * @method showFilters
         */
        showFilters: function() {
            this.currentPage = new PageFilters();
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
            this.currentPage = new PageList();
            this.currentPage.set(listId).render();
        },
        /**
         * @method showListSection
         * @param {String} listId
         * @param {String} sectionId
         */
        showListSection: function(listId, sectionId) {
            this.currentPage = new PageListSection();
            this.currentPage.set(listId, sectionId).render();
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
         * @method showScratchpad
         * @param {String} vocabIds
         */
        showScratchpad: function(writings) {
            var self = this;
            writings = writings.split('|');
            this.currentPage = new PageScratchpad();
            if (app.user.isAuthenticated() || app.api.isGuestValid()) {
                this.currentPage.render().load(writings);
            } else {
                app.dialogs.show().element('.message-title').text('Authenticating Guest');
                app.api.authenticateGuest(function() {
                    app.dialogs.hide(function() {
                        self.currentPage.render().load(writings);
                    });
                }, function() {
                    self.defaultRoute();
                    app.dialogs.hide();
                });
            }
        },
        /**
         * @method showSettings
         */
        showSettings: function() {
            this.currentPage = new PageSettings();
            this.currentPage.render();
        },
        /**
         * @method showStarred
         */
        showStarred: function() {
            this.currentPage = new PageStarred();
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
        },
        /**
         * @method showWords
         * @param {String} [filter]
         */
        showWords: function(filter) {
            this.currentPage = new PageWords();
            this.currentPage.render().set(filter);
        }
    });

    return Router;
});
