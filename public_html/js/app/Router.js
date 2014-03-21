/**
 * @module Skritter
 * @param Home
 * @param Info
 * @param Study
 * @param StudySettings
 * @param Tests
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Info',
    'views/Study',
    'views/study/Settings',
    'views/Tests'
], function(Home, Info, Study, StudySettings, Tests) {
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
            'info/:writing': 'showInfoView',
            'info/:language/:writing': 'showInfoView',
            'study': 'showStudyView',
            'study/settings': 'showStudySettingsView',
            'tests': 'showTestsView'
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
            if (!this.view.studySettings) {
                this.view.studySettings = new Study({el: $('#skritter-container')});
            } else {
                this.view.studySettings.setElement($('#skritter-container'));
            }
            this.view.studySettings.render();
        },
        /**
         * Shows the the study view.
         * 
         * @method showStudyView
         */
        showStudySettingsView: function() {
            if (!this.view.study) {
                this.view.study = new StudySettings({el: $('#skritter-container')});
            } else {
                this.view.study.setElement($('#skritter-container'));
            }
            this.view.study.render();
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