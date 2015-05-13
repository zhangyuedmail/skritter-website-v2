/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/StrokeShape'
], function(GelatoCollection, StrokeShape) {

    /**
     * @class StrokeShapes
     * @extends GelatoCollection
     */
    var StrokeShapes = GelatoCollection.extend({
        /**
         * @property model
         * @type StrokeShape
         */
        model: StrokeShape
    });

    return StrokeShapes;

});