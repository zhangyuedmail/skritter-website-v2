var GelatoCollection = require('gelato/collection');
var Stroke = require('models/stroke');

/**
 * @class Strokes
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @property model
     * @type {Stroke}
     */
    model: Stroke
});
