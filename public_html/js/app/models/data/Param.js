/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class DataParam
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
         * @method cornersLength
         * @returns {Number}
         */
        cornersLength: function() {
            var cornersLength = 0;
            var corners = this.get('corners');
            for (var i = 0, length = corners.length - 1; i < length; i++)
                cornersLength += skritter.fn.distance(corners[i], corners[i + 1]);
            return cornersLength;
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