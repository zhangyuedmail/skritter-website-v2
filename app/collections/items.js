var SkritterCollection = require('base/skritter-collection');
var ContainedItems = require('collections/contained-items');
var Vocabs = require('collections/vocabs');
var Item = require('models/item');

/**
 * @class Items
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this._cursor = null;
        this.contained = new ContainedItems();
        this.vocabs = new Vocabs();
    },
    /**
     * @property model
     * @type {Item}
     */
    model: Item,
    /**
     * @property url
     * @type {String}
     */
    url: 'items',
    /**
     * @method comparator
     * @param {Item} item
     * @return {Number}
     */
    comparator: function(item) {
        return -item.get('next');
    },
    /**
     * @method getNext
     * @returns {Item}
     */
    getNext: function() {
        return this.sort().at(0);
    },
    /**
     * @method parse
     * @param {Object} response
     * @returns {Object}
     */
    parse: function(response) {
        this._cursor = response.cursor;
        this.contained.add(response.ContainedItems);
        this.vocabs.add(response.Vocabs);
        this.vocabs.decomps.add(response.Decomps);
        this.vocabs.sentences.add(response.Sentences);
        this.vocabs.strokes.add(response.Strokes);
        return response.Items;
    }
});
