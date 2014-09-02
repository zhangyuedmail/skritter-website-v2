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
            'vclick .action-back': 'handleActionBackClicked',
            'vclick .action-logout': 'handleActionLogoutClicked',
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
         * @method destroy
         */
        destroy: function() {
            var keys = _.keys(this);
            for (var key in keys) {
                this[keys[key]] = undefined;
            }
        },
        /**
         * @method handleActionBackClicked
         * @param {Event} event
         */
        handleActionBackClicked: function(event) {
            event.preventDefault();
            if (app.router) {
                app.router.back();
            } else {
                location.back();
            }
        },
        /**
         * @method handleActionLogoutClicked
         * @param {Event} event
         */
        handleActionLogoutClicked: function(event) {
            event.preventDefault();
            app.user.logout();
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
            this.destroy();
            return this;
        }
    });
});
