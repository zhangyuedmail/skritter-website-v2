/**
 * @module Framework
 */
define([
    "framework/GelatoView",
    "require.text!templates/sidebars.html"
], function(GelatoView, template) {
    return GelatoView.extend({
        /**
         * @class GelatoSidebar
         * @extends GelatoView
         * @constructor
         */
        initialize: function() {
            this.render();
        },
        /**
         * @property el
         * @type String
         */
        el: "#sidebar",
        /**
         * @method template
         * @returns {String}
         */
        template: function() {
            return Handlebars.compile(template)(app.strings);
        },
        /**
         * @method render
         * @returns {GelatoDialog}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            "swipeleft": "handleSwipeLeft"
        },
        /**
         * @method handleSwipeLeft
         * @param {Event} event
         */
        handleSwipeLeft: function(event) {
            event.preventDefault();
            this.hide();
        },
        /**
         * @method hide
         * @returns {GelatoSidebar}
         */
        hide: function() {
            $(".gelato-sidebar-button").removeClass("active");
            this.$el.removeClass("expanded");
            this.$el.hide("slide", {direction: "left"}, 300);
            app.router.currentView.getContent().css("opacity", 1.0);
            return this;
        },
        /**
         * @method isExpanded
         * @returns {Boolean}
         */
        isExpanded: function() {
            return this.$el.hasClass("expanded") ? true : false;
        },
        /**
         * @method remove
         * @returns {GelatoSidebar}
         */
        remove: function() {
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
            return this;
        },
        /**
         * @method show
         * @returns {GelatoSidebar}
         */
        show: function() {
            $(".gelato-sidebar-button").addClass("active");
            this.$el.addClass("expanded");
            this.$el.show("slide", {direction: "left"}, 300);
            app.router.currentView.getContent().css("opacity", 0.5);
            return this;
        },
        /**
         * @method switch
         * @param {String} name
         * @returns {GelatoSidebar}
         */
        switch: function(name) {
            this.$(".sidebar-template").removeClass("active");
            this.$("#sidebar-" + name).addClass("active");
            return this;
        },
        /**
         * @method toggle
         */
        toggle: function() {
            if (this.$el.hasClass("expanded")) {
                this.hide();
            } else {
                this.show();
            }
        }
    });
});
