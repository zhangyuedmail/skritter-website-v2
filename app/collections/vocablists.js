var Vocablist = require('models/vocablist');
var SkritterCollection = require('base/skritter-collection');

/**
 * @class Vocablists
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
     * @type {Vocablist}
     */
    model: Vocablist,
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
    url: 'vocablists',
    /**
     * @method getAdding
     */
    getAdding: function() {
        return this.filter(function(v) {
            return v.get('studyingMode') === 'adding';
        });
    },
    /**
     * @method getAdding
     */
    getReviewing: function() {
        return this.filter(function(v) {
            return _.contains(['reviewing', 'finished'], v.get('studyingMode'))
        });
    }
});
