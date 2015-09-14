var GelatoCollection = require('gelato/collection');
var StrokeParams = require('collections/stroke-params');
var Stroke = require('models/stroke');


//TODO: replace stroke shapes with a collection
//var StrokeShapes = require('collections/stroke-shapes');
var ShapeData = require('data/shape-data');

/**
 * @class Strokes
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.params = new StrokeParams();
        this.shapes = ShapeData;
    },
    /**
     * @property model
     * @type {Stroke}
     */
    model: Stroke
});
