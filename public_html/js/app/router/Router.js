define([
    'view/Home',
    'view/Landing',
    'view/Login',
    'view/Study',
    'view/study/Settings',
    'view/Test'
], function(HomeView, LandingView, LoginView, StudyView, StudySettings, TestView) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.container = $('.skritter-container');
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
            'study': 'showStudy',
            'study/settings': 'showStudySettings',
            'test': 'showTest'
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
                if (skritter.modal.isVisible()) {
                    skritter.modal.hide();
                } else {
                    skritter.modal.show('exit');
                    skritter.modal.element('.modal-button-ok').on('vclick', function() {
                        window.navigator.app.exitApp();
                    });
                }
            } else {
                window.history.back();
            }
            event.preventDefault();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            this.reset();
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
            this.reset();
            this.view = new LoginView({el: this.container});
            this.view.render();
        },
         /**
         * @method showStudy
         */
        showStudy: function() {
            this.reset();
            this.view = new StudyView({el: this.container});
            this.view.render();
        },
        /**
         * @method showStudySettings
         */
        showStudySettings: function() {
            this.reset();
            this.view = new StudySettings({el: this.container});
            this.view.render();
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