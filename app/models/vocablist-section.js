var SkritterModel = require('base/skritter-model');

/**
 * @class VocablistSection
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property initialize
     * @param {Object} options
     */
    initialize: function(options) {
        this.vocablistId = _.result(options, 'vocablistId');
    },
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @method urlRoot
     * @returns {String}
     */
    urlRoot: function() {
        if (!this.vocablistId) {
            throw new Error('Was not given vocablistId, cannot construct API URL');
        }
        return 'vocablists/'+this.vocablistId+'/sections'
    },
    /**
     * @method parse
     * @returns {Object}
     */
    parse: function(response) {
        return response.VocabListSection || response;
    }
});
