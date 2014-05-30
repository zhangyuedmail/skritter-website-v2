define(function() {
    /**
     * @class View
     */
    var BaseView = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.element = {};
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-back': 'handleBackClicked',
            'vclick .button-home': 'handleHomeClicked',
            'vclick .button-logout': 'handleLogoutClicked',
            'vclick .content-container': 'handleContentContainerClicked',
            'vclick .navbar-toggle-sidebar': 'handleSidebarToggled'
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.element.fontPreloader = this.$('.font-preloader');
            this.element.sidebar = this.$('.sidebar');
            this.preloadFont();
            return this;
        },
        /**
         * @method handleBackClicked
         * @param {Object} event
         */
        handleBackClicked: function(event) {
            window.history.back();
            event.preventDefault();
        },
        /**
         * @method handleContentContainerClicked
         * @param {Object} event
         */
        handleContentContainerClicked: function(event) {
            if (this.element.sidebar.hasClass('expanded')) {
                this.toggleSidebar();
            }
            event.preventDefault();
        },
        /**
         * @method handleHomeClicked
         * @param {Object} event
         */
        handleHomeClicked: function(event) {
            skritter.router.navigate('', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleLogoutClicked
         * @param {Object} event
         */
        handleLogoutClicked: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        /**
         * @method handleSidebarToggled
         * @param {Object} event
         */
        handleSidebarToggled: function(event) {
            this.toggleSidebar();
            event.preventDefault();
        },
        /**
         * @method preloadFont
         */
        preloadFont: function() {
            if (this.element.fontPreloader) {
                if (skritter.user.getLanguageCode() === 'zh') {
                    this.element.fontPreloader.addClass('chinese-text');
                } else {
                    this.element.fontPreloader.addClass('japanese-text');
                }
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method toggleSidebar
         */
        toggleSidebar: function() {
            if (this.element.sidebar.hasClass('expanded')) {
                this.element.sidebar.removeClass('expanded');
                this.element.sidebar.hide('slide', {direction: 'left'}, 200);
            } else {
                this.element.sidebar.addClass('expanded');
                this.element.sidebar.show('slide', {direction: 'left'}, 200);
            }
        }
    });
    
    return BaseView;
});