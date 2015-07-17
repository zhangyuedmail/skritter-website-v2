var GelatoCollection = require('gelato/collection');
var DataStroke = require('models/data-stroke');
var KanaStrokes = require('data/kana-strokes');
var StrokeShapes = require('data/stroke-shapes');
var ToneStrokes = require('data/tone-strokes');

/**
 * @class DataStrokes
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.shapes = StrokeShapes;
        this.add(KanaStrokes.getData());
        this.add(ToneStrokes.getData());
    },
    /**
     * @property model
     * @type {DataStroke}
     */
    model: DataStroke,
    /**
     * @method getPromptTones
     * @returns {PromptCharacter}
     */
    getPromptTones: function() {
        return this.get('tones').getPromptCharacter();
    }
});
