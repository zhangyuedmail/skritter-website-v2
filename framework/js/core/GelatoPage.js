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
         * @property title
         * @type String
         */
        title: undefined,
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
         * @method disableForm
         * @param {String} selector
         */
        disableForm: function(selector) {
            this.$((selector ? selector + ' ': '') + ':input').prop('disabled', true);
        },
        /**
         * @method enableForm
         * @param {String} selector
         */
        enableForm: function(selector) {
            this.$((selector ? selector: ' ') + ':input').prop('disabled', false);
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
         */
        handleClickContent: function() {
            if (app.sidebar && app.sidebar.isExpanded()) {
                app.sidebar.toggle();
            }
        },
        /**
         * @method handleClickSidebarToggle
         */
        handleClickSidebarToggle: function() {
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
