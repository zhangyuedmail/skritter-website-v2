var DataVocablist = require('models/data-vocablist');
var SkritterCollection = require('base/skritter-collection');

/**
 * @class MyVocablists
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.cursor = null;
    },
    /**
     * @property model
     * @type {DataVocablist}
     */
    model: DataVocablist,
    /**
     * @method parse
     * @param {Object} response
     * @returns Array
     */
    parse: function(response) {
        this.cursor = response.cursor;
        return response.VocabLists;
    },
    /**
     * @property url
     * @type {String}
     */
    url: 'vocablists'
});
