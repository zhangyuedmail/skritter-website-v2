/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class StrokeShape
     * @extends GelatoModel
     */
    var StrokeShape = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function() {
            return {
                graphics: new createjs.Graphics(),
                height: 0,
                width: 0,
                x: 0,
                y: 0
            };
        }
    });

    return StrokeShape;

});