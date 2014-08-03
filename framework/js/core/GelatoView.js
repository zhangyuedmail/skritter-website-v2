/**
 * @module Framework
 */
define([], function() {
    /**
     * @class GelatoView
     * @extends Backbone.View
     */
    return Backbone.View.extend({
        /**
         * @property elements
         * @type Object
         */
        elements: {},
        /**
         * @method compile
         * @param {String} template
         * @returns {String}
         */
        compile: function(template) {
            return Handlebars.compile(template)(app.strings);
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
