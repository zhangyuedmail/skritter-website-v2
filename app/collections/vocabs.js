var SkritterCollection = require('base/skritter-collection');
var Decomps = require('collections/decomps');
var Sentences = require('collections/sentences');
var Strokes = require('collections/strokes');
var Vocab = require('models/vocab');

/**
 * @class Vocabs
 * @param {Array|Object} [models]
 * @param {Object} [options]
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(models, options) {
        options = options || {};
        this.cursor = null;
        this.cursorContaining = null;
        this.decomps = new Decomps();
        this.items = options.items;
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
        this.cursor = response.cursor;
        this.cursorContaining = response.containingCursor;
        this.decomps.add(response.Decomps);
        this.sentences.add(response.Sentences);
        this.strokes.add(response.Strokes);
        return response.Vocabs.concat(response.ContainingVocabs || []);
    },
    /**
     * @method reset
     * @returns {Items}
     */
    reset: function() {
        this.decomps.reset();
        this.sentences.reset();
        this.strokes.reset();
        return SkritterCollection.prototype.reset.call(this);
    }
});
