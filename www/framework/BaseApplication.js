/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseApplication
     * @extends Backbone.Model
     */
    return Backbone.Model.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            $(window).on('throttledresize', _.bind(this.triggerResize, this));
        },
        /**
         * @method reload
         */
        reload: function() {
            if (app.router) {
                app.router.navigate('');
                location.reload(true);
            } else {
                location.href = '';
            }
        },
        /**
         * @method triggerResize
         * @param {Event} event
         */
        triggerResize: function(event) {
            this.trigger('resize', event);
        }
    });
});