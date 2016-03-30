var SkritterModel = require('base/skritter-model');

var Vocab = require('models/vocab');

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
     * @method parse
     * @returns {Object}
     */
    parse: function(response) {
        return response.VocabListSection || response;
    },
    /**
     * @method urlRoot
     * @returns {String}
     */
    urlRoot: function() {
        return 'vocablists/' + this.vocablistId + '/sections';
    },
    /**
     * @method getUniqueVocabIds
     * @returns {Array}
     */
    getUniqueVocabIds: function() {
        var vocabIds = _.map(this.get('rows'), 'vocabId');
        var tradVocabIds = [];

        if (app.getLanguage() === 'zh') {
            tradVocabIds = _.map(this.get('rows'), 'tradVocabId');
        }

        return _.uniq(vocabIds.concat(tradVocabIds));
    }
});
