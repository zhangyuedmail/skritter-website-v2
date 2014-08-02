/**
 * @module Framework
 */
define([], function() {
    /**
     * @class GelatoApplication
     * @extends Backbone.Model
     */
    return Backbone.Model.extend({
        /**
         * @method getContainer
         * @returns {jQuery}
         */
        getContainer: function() {
            return $("#application");
        },
        /**
         * @method getHeight
         * @returns {Number}
         */
        getHeight: function() {
            return $(window).height();
        },
        /**
         * @method getWidth
         * @returns {Number}
         */
        getWidth: function() {
            return $(window).width();
        }
    });
});
