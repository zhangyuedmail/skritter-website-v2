define([], function() {
    /**
     * @class BaseView
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.loadElements();
            if (this.elements.fontPreloader) {
                this.preloadFont();
            }
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            this.elements.fontPreloader = this.$('.font-preloader');
            this.elements.sidebar = this.$('.sidebar');
            this.elements.userAvatar = this.$('.user-avatar');
            this.elements.userUsername = this.$('.user-username');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .content-container': 'handleContentContainerClick',
            'vclick .button-sidebar-home': 'handleHomeClick',
            'vclick .button-sidebar-lists': 'handleListClick',
            'vclick .button-sidebar-logout': 'handleLogoutClick',
            'vclick .button-sidebar-study': 'handleStudyClick',
            'vclick .navbar-toggle-sidebar': 'handleSidebarToggle'
        },
        /**
         * @method destroy
         */
        destroy: function() {
            var keys = _.keys(this);
            for (var key in keys) {
                this[keys[key]] = undefined;
            }
        },
        /**
         * @method disableForm
         */
        disableForm: function() {
            this.$(':input').prop('disabled', true);
        },
        /**
         * @method enableForm
         */
        enableForm: function() {
            this.$(':input').prop('disabled', false);
        },
        /**
         * @method handleBackClick
         * @param {Object} event
         */
        handleBackClick: function(event) {
            skritter.router.back();
            event.preventDefault();
        },
        /**
         * @method handleContentContainerClicked
         * @param {Object} event
         */
        handleContentContainerClicked: function(event) {
            console.log('clicked');
            if (this.elements && this.elements.sidebar.hasClass('expanded')) {
                this.toggleSidebar();
            }
            event.preventDefault();
        },
        /**
         * @method handleHomeClick
         * @param {Object} event
         */
        handleHomeClick: function(event) {
            skritter.router.navigate('', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleListClick
         * @param {Object} event
         */
        handleListClick: function(event) {
            skritter.router.navigate('vocab/list', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleLogoutClick
         * @param {Object} event
         */
        handleLogoutClick: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        /**
         * @method handleSidebarToggle
         * @param {Object} event
         */
        handleSidebarToggle: function(event) {
            this.toggleSidebar();
            event.preventDefault();
        },
        /**
         * @method handleStudyClick
         * @param {Object} event
         */
        handleStudyClick: function(event) {
            skritter.router.navigate('study', {replace: true, trigger: true});
            event.preventDefault();
        },
         /**
         * @method preloadFont
         */
        preloadFont: function() {
            if (this.elements.fontPreloader) {
                if (skritter.user.getLanguageCode() === 'zh') {
                    this.elements.fontPreloader.addClass('chinese-text');
                } else {
                    this.elements.fontPreloader.addClass('japanese-text');
                }
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            this.removeElements();
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
            this.destroy();
        },
        /**
         * @method removeElements
         * @returns {Object}
         */
        removeElements: function() {
            for (var i in this.elements) {
                this.elements[i].remove();
                this.elements[i] = undefined;
            }
            return this.elements;
        },
        /**
         * @method toggleSidebar
         */
        toggleSidebar: function() {
            if (this.elements) {
                if (this.elements && this.elements.sidebar.hasClass('expanded')) {
                    this.elements.sidebar.removeClass('expanded');
                    this.elements.sidebar.hide('slide', {direction: 'left'}, 300);
                } else {
                    this.elements.sidebar.addClass('expanded');
                    this.elements.sidebar.show('slide', {direction: 'left'}, 300);
                }
            }
        }
    });
    
    return View;
});