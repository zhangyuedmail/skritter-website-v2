/**
 * @module Skritter
 * @param Account
 * @param Home
 * @param Info
 * @param Study
 * @param StudySettings
 * @param Tests
 * @param Tutorial
 * @param VocabLists
 * @param User
 * @param UserNew
 * @author Joshua McFarland
 */
define([
    'views/user/Account',
    'views/Home',
    'views/Info',
    'views/Study',
    'views/study/Settings',
    'views/Tests',
    'views/Tutorial',
    'views/vocab/Lists',
    'views/User',
    'views/user/New'
], function(Account, Home, Info, Study, StudySettings, Tests, Tutorial, VocabLists, User, UserNew) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.view = {};
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHomeView',
            'account': 'showAccountView',
            'info/:writing': 'showInfoView',
            'info/:language/:writing': 'showInfoView',
            'study': 'showStudyView',
            'study/settings': 'showStudySettingsView',
            'tests': 'showTestsView',
            'tutorial': 'showTutorialView',
            'vocab/list': 'showVocabListsView',
            'user/:id': 'showUserView',
            'user/new': 'showUserNewView'
        },
        /**
         * Shortcut method for traversing backwards through the windows history.
         * 
         * @method back
         */
        back: function() {
            window.history.back();
        },
        /**
         * Shows the authenticated users account settings that can be edited.
         * 
         * @method showAccountView
         */
        showAccountView: function() {
            if (!this.view.account) {
                this.view.account = new Account({el: $('#skritter-container')});
            } else {
                this.view.account.setElement($('#skritter-container'));
            }
            this.view.account.render();
        },
        /**
         * Shows the homepage which either displays as logged in or out depending on the authentication status.
         * 
         * @method showHomeView
         */
        showHomeView: function() {
            if (!this.view.home) {
                this.view.home = new Home({el: $('#skritter-container')});
            } else {
                this.view.home.setElement($('#skritter-container'));
            }
            this.view.home.render();
        },
        /**
         * Shows the info view which requires character parameters be included in the url.
         * 
         * @method showInfoView
         * @param {String} language
         * @param {String} writing
         */
        showInfoView: function(language, writing) {
            if (!this.view.info) {
                this.view.info = new Info({el: $('#skritter-container')});
            } else {
                this.view.info.setElement($('#skritter-container'));
            }
            this.view.info.load(language, writing);
            this.view.info.render();
        },
        /**
         * Shows the the study view.
         * 
         * @method showStudyView
         */
        showStudyView: function() {
            if (!this.view.study) {
                this.view.study = new Study({el: $('#skritter-container')});
            } else {
                this.view.study.setElement($('#skritter-container'));
            }
            this.view.study.render();
        },
        /**
         * Shows the study view.
         * 
         * @method showStudyView
         */
        showStudySettingsView: function() {
            if (!this.view.studySettings) {
                this.view.studySettings = new StudySettings({el: $('#skritter-container')});
            } else {
                this.view.studySettings.setElement($('#skritter-container'));
            }
            this.view.studySettings.render();
        },
        /**
         * Runs and shows the results of the jasmine test cases.
         * 
         * @method showTestsView
         */
        showTestsView: function() {
            if (!this.view.tests) {
                this.view.tests = new Tests({el: $('#skritter-container')});
            } else {
                this.view.tests.setElement($('#skritter-container'));
            }
            this.view.tests.render();
        },
        /**
         * Shows the tutorial view for new users.
         * 
         * @method showTutorialView
         */
        showTutorialView: function() {
            if (!this.view.tutorial) {
                this.view.tutorial = new Tutorial({el: $('#skritter-container')});
            } else {
                this.view.tutorial.setElement($('#skritter-container'));
            }
            this.view.tutorial.render();
        },
        /**
         * @method showVocabListsView
         */
        showVocabListsView: function() {
            if (!this.view.vocabLists) {
                this.view.vocabLists = new VocabLists({el: $('#skritter-container')});
            } else {
                this.view.vocabLists.setElement($('#skritter-container'));
            }
            this.view.vocabLists.render();
        },
        /**
         * Shows another user or editable logged in user view.
         * 
         * @method showUserView
         * @param {String} id
         */
        showUserView: function(id) {
            if (!this.view.user) {
                this.view.user = new User({el: $('#skritter-container')});
            } else {
                this.view.user.setElement($('#skritter-container'));
            }
            this.view.user.set(id).render();
        },
        /**
         * Shows the new user account creation process view.
         * 
         * @method showUserNewView
         */
        showUserNewView: function() {
            if (!this.view.userNew) {
                this.view.userNew = new UserNew({el: $('#skritter-container')});
            } else {
                this.view.userNew.setElement($('#skritter-container'));
            }
            this.view.userNew.render();
        }
    });

    /**
     * Initialized the router and enabled pushState based on the environment. If the application
     * is run from a local server then it's disabled to prevent routing errors.
     * 
     * @method initialize
     */
    var initialize = function() {
        skritter.router = new Router();
        Backbone.history.start(skritter.fn.isLocal() ? {} : {pushState: true});
    };

    return {
        initialize: initialize
    };
});