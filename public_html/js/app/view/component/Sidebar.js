define([
    'require.text!template/sidebar.html',
    'view/View'
], function(template, View) {
    /**
     * @class Sidebar
     */
    var Sidebar = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Sidebar}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            this.$el.find('.app-version').text(skritter.getVersion());
            $('.content-container').on('vclick', _.bind(this.handleContentContainerClick, this));
            $('.navbar-sidebar-toggle').on('vclick', _.bind(this.handleToggle, this));
            return this;
        },

        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, View.prototype.events, {
                'vclick .button-sidebar-account': 'handleAccountClick',
                'vclick .button-sidebar-home': 'handleHomeClick',
                'vclick .button-sidebar-lists': 'handleListClick',
                'vclick .button-sidebar-logout': 'handleLogoutClick',
                'vclick .button-sidebar-study': 'handleStudyClick'
            });
        },
        /**
         * @method handleAccountClick
         * @param {Object} event
         */
        handleAccountClick: function(event) {
            skritter.router.navigate('user/account', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleContentContainerClicked
         * @param {Object} event
         */
        handleContentContainerClick: function(event) {
            if (this.$el.hasClass('expanded')) {
                this.toggle();
                event.preventDefault();
            }
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
         * @method handleStudyClick
         * @param {Object} event
         */
        handleStudyClick: function(event) {
            skritter.router.navigate('study', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleSidebarToggle
         * @param {Object} event
         */
        handleToggle: function(event) {
            this.toggle();
            event.preventDefault();
        },
        /**
         * @method toggle
         */
        toggle: function() {
            if (this.$el.hasClass('expanded')) {
                this.$el.removeClass('expanded');
                this.$el.hide('slide', {direction: 'left'}, 300);
            } else {
                this.$el.addClass('expanded');
                this.$el.show('slide', {direction: 'left'}, 300);
            }
        }
    });

    return Sidebar;
});