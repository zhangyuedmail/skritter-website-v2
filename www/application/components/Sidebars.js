/**
 * @module Application
 */
define([
    'framework/BaseView',
    "require.text!templates/sidebars.html"
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
            this.selected = 'default';
            this.render();
        },
        /**
         * @property el
         * @type String
         */
        el: "#sidebars",
        /**
         * @method render
         * @returns {Sidebars}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: function(){
            return _.extend({}, BaseView.prototype.events, {});
        },
        /**
         * @method hide
         * @returns {Sidebars}
         */
        hide: function() {
            $(".navbar-sidebar-toggle").removeClass("active");
            this.$('#sidebar-' + this.selected).removeClass('expanded');
            this.$('#sidebar-' + this.selected).hide();
            return this;
        },
        /**
         * @method isExpanded
         * @returns {Boolean}
         */
        isExpanded: function() {
            return this.$('#sidebar-' + this.selected).hasClass('expanded') ? true : false;
        },
        /**
         * @method select
         * @param {String} name
         * @returns {Sidebars}
         */
        select: function(name) {
            var select = this.$el.find('#sidebar-' + name);
            console.log(select);
            return this;
        },
        /**
         * @method show
         * @returns {Sidebars}
         */
        show: function() {
            $(".navbar-sidebar-toggle").addClass("active");
            this.$('#sidebar-' + this.selected).addClass('expanded');
            this.$('#sidebar-' + this.selected).show();
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