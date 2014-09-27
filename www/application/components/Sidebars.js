/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView',
    'require.text!templates/sidebars.html'
], function(BaseView, template) {
    /**
     * @class Sidebars
     * @extends BaseView
     */
    var Sidebars = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.direction = 'left';
            this.enabled = true;
            this.name = 'default';
            this.sidebar = undefined;
            this.speed = 300;
            this.render();
        },
        /**
         * @property el
         * @type String
         */
        el: '#sidebars',
        /**
         * @method render
         * @returns {Sidebars}
         */
        render: function() {
            this.$el.html(this.compile(template));
            this.select();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
            'swipeleft .sidebar': 'handleSidebarSwipeLeft',
            'swiperight .sidebar': 'handleSidebarSwipeRight'
        }),
        /**
         * @method disable
         * returns {Sidebars}
         */
        disable: function() {
            if (this.isExpanded()) {
                this.hide();
            }
            this.enabled = false;
        },
        /**
         * @method enable
         * returns {Sidebars}
         */
        enable: function() {
            this.enabled = true;
        },
        /**
         * @method handleSidebarSwipeLeft
         * @param {Event} event
         */
        handleSidebarSwipeLeft: function(event) {
            event.preventDefault();
            if (this.direction === 'left') {
                this.hide();
            }
        },
        /**
         * @method handleSidebarSwipeRight
         * @param {Event} event
         */
        handleSidebarSwipeRight: function(event) {
            event.preventDefault();
            if (this.direction === 'right') {
                this.hide();
            }
        },
        /**
         * @method hide
         * @param {Number} [speed]
         * @returns {Sidebars}
         */
        hide: function(speed) {
            if (this.enabled) {
                $('.navbar-menu.toggle').removeClass('active');
                this.sidebar.removeClass('expanded');
                this.sidebar.hide('slide', {direction: this.direction}, speed ? speed : this.speed);
            }
            return this;
        },
        /**
         * @method isExpanded
         * @returns {Boolean}
         */
        isExpanded: function() {
            return this.sidebar.hasClass('expanded') ? true : false;
        },
        /**
         * @method select
         * @param {String} [name]
         * @returns {Sidebars}
         */
        select: function(name) {
            var sidebar = this.$('#sidebar-' + name);
            if (sidebar.length) {
                this.direction = sidebar.hasClass('right') ? 'right' : 'left';
                this.name = name;
                this.sidebar = sidebar;
            } else {
                this.direction = 'left';
                this.name = 'default';
                this.sidebar = this.$('#sidebar-default');
            }
            return this;
        },
        /**
         * @method show
         * @param {Number} [speed]
         * @returns {Sidebars}
         */
        show: function(speed) {
            if (this.enabled) {
                $('.navbar-menu.toggle').addClass('active');
                this.sidebar.addClass('expanded');
                this.sidebar.show('slide', {direction: this.direction}, speed ? speed : this.speed);
            }
            return this;
        },
        /**
         * @method toggle
         */
        toggle: function() {
            if (this.isExpanded()) {
                this.hide();
            } else {
                this.show();
            }
        }
    });

    return Sidebars;
});