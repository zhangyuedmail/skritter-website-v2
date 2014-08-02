/**
 * @module Framework
 */
define([
    "framework/GelatoView"
], function(GelatoView) {
    /**
     * @class GelatoPage
     * @extends GelatoView
     */
    return GelatoView.extend({
        /**
         * @property el
         * @type String
         */
        el: "#application",
        /**
         * @property events
         * @type Object
         */
        events: {
            "vclick .gelato-content": "handleClickContent",
            "vclick .gelato-sidebar-toggle": "handleClickSidebarToggle"
        },
        /**
         * @method compile
         * @param {String} template
         * @returns {String}
         */
        compile: function(template) {
            return Handlebars.compile(template)(app.strings);
        },
        /**
         * @method getContent
         * @returns {jQuery}
         */
        getContent: function() {
            return this.$("#content");
        },
        /**
         * @method handleClickContent
         * @param {Event} event
         */
        handleClickContent: function(event) {
            event.preventDefault();
            if (app.sidebar && app.sidebar.isExpanded()) {
                app.sidebar.toggle();
            }
        },
        /**
         * @method handleClickSidebarToggle
         * @param {Event} event
         */
        handleClickSidebarToggle: function(event) {
            event.preventDefault();
            if (app.sidebar) {
                app.sidebar.toggle();
            }
        },
        /**
         * @method remove
         * @returns {GelatoView}
         */
        remove: function() {
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
            return this;
        }
    });
});
