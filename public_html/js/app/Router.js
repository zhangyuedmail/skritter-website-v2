/**
 * @module Skritter
 * @param Account
 * @param Home
 * @param Login
 * @param ParamEditor
 * @param Review
 * @param Study
 * @param StudySettings
 * @param Test
 * @param VocabInfo
 * @param VocabList
 * @param VocabLists
 * @author Joshua McFarland
 */
define([
    'view/Account',
    'view/Home',
    'view/Login',
    'view/admin/ParamEditor',
    'view/admin/Review',
    'view/Study',
    'view/study/Settings',
    'view/Test',
    'view/vocab/info',
    'view/vocab/List',
    'view/vocab/Lists'
], function(Account, Home, Login, ParamEditor, Review, Study, StudySettings, Test, VocabInfo, VocabList, VocabLists) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.container = $('#skritter-container');
            this.view = null;
            Backbone.history.start();
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'home',
            'account': 'account',
            'admin/param/:strokeId': 'adminParamEditor',
            'login': 'login',
            'review': 'review',
            'study': 'study',
            'study/settings': 'studySettings',
            'test': 'test',
            'vocab/info/:languageCode/:writing': 'vocabInfo',
            'vocab/list': 'vocabLists',
            'vocab/list/category/:category': 'vocabLists',
            'vocab/list/:listId': 'vocabList',
            'vocab/list/:listId/:sectionId': 'vocabList'
        },
        /**
         * @method removeView
         */
        removeView: function() {
            if (this.view)
                this.view.remove();
            this.view = null;
        },
        /**
         * @method adminEditor
         * @param {Number} strokeId
         */
        adminParamEditor: function(strokeId) {
            this.removeView();
            this.view = new ParamEditor({el: this.container});
            this.view.setStrokeId(strokeId).render();
        },
        /**
         * @method account
         */
        account: function() {
            this.removeView();
            this.view = new Account({el: this.container});
            this.view.render();
        },
        /**
         * @method home
         */
        home: function() {
            this.removeView();
            this.view = new Home({el: this.container});
            this.view.render();
        },
        /**
         * @method login
         */
        login: function() {
            this.removeView();
            this.view = new Login({el: this.container});
            this.view.render();
        },
        /**
         * @method review
         */
        review: function() {
            this.removeView();
            this.view = new Review({el: this.container});
            this.view.render();
        },
        /**
         * @method study
         */
        study: function() {
            this.removeView();
            this.view = new Study({el: this.container});
            this.view.render();
        },
        /**
         * @method studySettings
         */
        studySettings: function() {
            this.removeView();
            this.view = new StudySettings({el: this.container});
            this.view.render();
        },
        /**
         * @method test
         */
        test: function() {
            this.removeView();
            this.view = new Test({el: this.container});
            this.view.render();
        },
        /**
         * @method vocabInfo
         * @param {String} languageCode
         * @param {String} writing
         */
        vocabInfo: function(languageCode, writing) {
            this.removeView();
            this.view = new VocabInfo({el: this.container});
            this.view.render().set(languageCode, writing);
        },
        /**
         * @method vocabList
         * @param {String} listId
         * @param {String} sectionId
         */
        vocabList: function(listId, sectionId) {
            this.removeView();
            this.view = new VocabList({el: this.container});
            this.view.render().set(listId, sectionId);
        },
        /**
         * @method vocabLists
         * @param {String} category
         */
        vocabLists: function(category) {
            this.removeView();
            this.view = new VocabLists({el: this.container});
            this.view.render().set(category);
        }
    });

    return Router;
});