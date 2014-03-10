/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Param
     */
    var Param = Backbone.Model.extend({
        /**
         * @method angle
         * @returns {Number}
         */
        angle: function() {
            return skritter.fn.angle(this.get('corners'));
        },
        /**
         * @method rectangle
         * @returns {Object}
         */
        rectangle: function() {
            var size = skritter.settings.get('canvasSize');
            return skritter.fn.boundingRectangle(_.clone(this.get('corners')), size, size, 14);
        }
    });

    return Param;
});