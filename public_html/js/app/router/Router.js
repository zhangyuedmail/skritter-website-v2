define([
    'view/user/Account',
    'view/Home',
    'view/vocab/Info',
    'view/Landing',
    'view/vocab/List',
    'view/vocab/ListSection',
    'view/vocab/Lists',
    'view/Login',
    'view/Signup',
    'view/Study',
    'view/study/Settings',
    'view/Test'
], function(Account, HomeView, InfoView, LandingView, ListView, ListSectionView, ListsView, LoginView, SignupView, StudyView, StudySettings, TestView) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.container = $('.skritter-container');
            this.history = [];
            this.view = null;
            Backbone.history.start();
            window.document.addEventListener('backbutton', _.bind(this.handleBackButtonPressed, this), false);
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHome',
            'login': 'showLogin',
            'signup': 'showSignup',
            'study': 'showStudy',
            'study/settings': 'showStudySettings',
            'test': 'showTest',
            'user/account': 'showAccount',
            'vocab/info/:languageCode/:writing': 'showVocabInfo',
            'vocab/list': 'showVocabLists',
            'vocab/list/category/:category': 'showVocabLists',
            'vocab/list/:listId/:sectionId': 'showVocabListSection',
            'vocab/list/:listId': 'showVocabList'
        },
        /**
         * @method addHistory
         * @param {String} path
         */
        addHistory: function(path) {
            if (this.history.indexOf(path) === -1) {
               this.history.unshift(path);
            }
        },
        /**
         * @method back
         */
        back: function() {
            this.navigate(this.history[0], {replace: true, trigger: true});
        },
        /**
         * @method handleBackButtonPressed
         * @param {Object} event
         */
        handleBackButtonPressed: function(event) {
            var fragment = Backbone.history.fragment;
            if (this.view.elements.sidebar && this.view.elements.sidebar.hasClass('expanded')) {
                this.view.toggleSidebar();
            } else if (fragment === '') {
                skritter.modal.show('exit')
                        .set('.modal-title', 'Are you sure?')
                        .set('.modal-title-icon', null, 'fa-sign-out');
                skritter.modal.element('.modal-button-ok').on('vclick', function() {
                    window.navigator.app.exitApp();
                });
            } else {
                window.history.back();
            }
            event.preventDefault();
        },
        /**
         * @method showAccount
         */
        showAccount: function() {
            this.reset();
            this.addHistory('');
            if (skritter.user.isLoggedIn()) {
                this.view = new Account({el: this.container});
            }
            this.view.render();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            this.reset();
            this.addHistory('');
            if (skritter.user.isLoggedIn()) {
                this.view = new HomeView({el: this.container});
            } else {
                this.view = new LandingView({el: this.container});
            }
            this.view.render();
        },
        /**
         * @method showLogin
         */
        showLogin: function() {
            if (!skritter.user.isLoggedIn()) {
                this.reset();
                this.view = new LoginView({el: this.container});
                this.view.render();
            } else {
                this.navigate('login', {replace: true, trigger: true});
            }
        },
        /**
         * @method showSignup
         */
        showSignup: function() {
            if (!skritter.user.isLoggedIn()) {
                this.reset();
                this.view = new SignupView({el: this.container});
                this.view.render();
            } else {
                this.navigate('', {replace: true, trigger: true});
            }
        },
        /**
         * @method showStudy
         */
        showStudy: function() {
            if (skritter.user.isLoggedIn()) {
                this.reset();
                this.addHistory('study');
                this.view = new StudyView({el: this.container});
                this.view.render();
            } else {
                this.navigate('', {replace: true, trigger: true});
            }
        },
        /**
         * @method showStudySettings
         */
        showStudySettings: function() {
            if (skritter.user.isLoggedIn()) {
                this.reset();
                this.view = new StudySettings({el: this.container});
                this.view.render();
            } else {
                this.navigate('', {replace: true, trigger: true});
            }
        },
        /**
         * @method showTest
         */
        showTest: function() {
            this.reset();
            this.view = new TestView({el: this.container});
            this.view.render();
        },
        /**
         * @method showVocabInfo
         * @param {String} languageCode
         * @param {String} writing
         */
        showVocabInfo: function(languageCode, writing) {
            if (skritter.user.isLoggedIn()) {
                this.reset();
                this.view = new InfoView({el: this.container});
                this.view.set(languageCode, writing);
                this.view.render();
            } else {
                this.navigate('', {replace: true, trigger: true});
            }
        },
        /**
         * @method showVocabList
         * @param {String} listId
         * @param {String} sectionId
         */
        showVocabList: function(listId) {
            this.reset();
            this.view = new ListView({el: this.container});
            this.view.render();
        },
        /**
         * @method showVocabListSection
         * @param {String} category
         */
        showVocabListSection: function(listId, sectionId) {
            this.reset();
            this.view = new ListSectionView({el: this.container});
            this.view.render();
        },
        /**
         * @method showVocabLists
         * @param {String} category
         */
        showVocabLists: function(category) {
            this.reset();
            this.view = new ListsView({el: this.container});
            this.view.render();
        },
        /**
         * @method reset
         */
        reset: function() {
            if (this.view) {
                this.view.remove();
                this.view = undefined;
            }
        }
    });

    return Router;
});