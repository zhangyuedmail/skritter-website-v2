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
         * @method rectangle
         * @returns {Object}
         */
        rectangle: function() {
            var size = this.size();
            return skritter.fn.boundingRectangle(_.clone(this.get('corners')), size, size, 14);
        },
        /**
         * @method size
         * @returns {Number}
         */
        size: function() {
            return skritter.router.view.study.prompt.size.canvas;
        }
    });

    return Param;
});