/**
 * @module Application
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
        events: function(){
            return _.extend({}, BaseView.prototype.events, {
                'swipeleft .sidebar': 'handleSidebarSwipeLeft'
            });
        },
        /**
         * @method handleSidebarSwipeLeft
         * @param {Event} event
         */
        handleSidebarSwipeLeft: function(event) {
            event.preventDefault();
            this.hide();
        },
        /**
         * @method hide
         * @param {Number} [speed]
         * @returns {Sidebars}
         */
        hide: function(speed) {
            $('.navbar-menu.toggle').removeClass('active');
            this.sidebar.removeClass('expanded');
            this.sidebar.hide('slide', {direction: 'left'}, speed ? speed : this.speed);
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
                this.name = name;
                this.sidebar = sidebar;
            } else {
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
            $('.navbar-menu.toggle').addClass('active');
            this.sidebar.addClass('expanded');
            this.sidebar.show('slide', {direction: 'left'}, speed ? speed : this.speed);
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