/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseView
     * @extends Backbone.View
     */
    return Backbone.View.extend({
        /**
         * @property elements
         * @type Object
         */
        elements: {},
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .navigate': 'handleNavigateClicked'
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
         * @method handleNavigateClicked
         * @param {Event}
         */
        handleNavigateClicked: function(event) {
            event.preventDefault();
            var url = $(event.currentTarget).data('url').replace('#', '');
            var replace = $(event.currentTarget).data('replace');
            var trigger = $(event.currentTarget).data('trigger');
            app.router.navigate(url, {
                replace: replace === undefined ? false : replace,
                trigger: trigger === undefined ? true : trigger
            });
        },
        /**
         * @method remove
         * @returns {BaseView}
         */
        remove: function() {
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
            return this;
        }
    });
});
