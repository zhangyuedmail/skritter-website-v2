var SkritterCollection = require('base/skritter-collection');
var Decomps = require('collections/decomps');
var Sentences = require('collections/sentences');
var Strokes = require('collections/strokes');
var Vocab = require('models/vocab');

/**
 * @class Vocabs
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this._cursor = null;
        this.decomps = new Decomps();
        this.sentences = new Sentences();
        this.strokes = new Strokes();
    },
    /**
     * @property model
     * @type {Vocab}
     */
    model: Vocab,
    /**
     * @property url
     * @type {String}
     */
    url: 'vocabs',
    /**
     * @method parse
     * @param {Object} response
     * @returns Array
     */
    parse: function(response) {
        this._cursor = response.cursor;
        this.decomps.add(response.Decomps);
        this.sentences.add(response.Sentences);
        this.strokes.add(response.Strokes);
        return response.Vocabs;
    }
});
