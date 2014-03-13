/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Assets
     */
    var Assets = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Assets.audio = new Audio();
        },
        /**
         * @method stroke
         * @param {Number} bitmapId
         * @param {String} color
         * @returns {CreateJS.Shape}
         */
        stroke: function(bitmapId, color) {
            color = (color) ? color : '#000000';
            return skritter.fn.strokes[bitmapId](color);
        }
    });
    
    return Assets;
});