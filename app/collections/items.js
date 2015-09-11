var SkritterCollection = require('base/skritter-collection');
var Item = require('models/item');
var Vocabs = require('collections/vocabs');

/**
 * @class Items
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     */
    initialize: function() {
        this.vocabs = new Vocabs();
    },
    /**
     * @property model
     * @type {Item}
     */
    model: Item,
    /**
     * @method parse
     * @param {Object} response
     * @returns Array
     */
    parse: function(response) {
        if (response.Vocabs) {
            this.vocabs.add(response.Vocabs);
        }
        this.cursor = response.cursor;
        return response.Items || response;
    },
    /**
     * @property url
     * @type {String}
     */
    url: 'items'
});
