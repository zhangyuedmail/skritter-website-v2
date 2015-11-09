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
     * @method fetchVocabs
     * @param {Object} [options]
     */
    fetchVocabs: function(options) {
        var vocabs = [];
        options = options || {};
        async.eachSeries(
            this.get('rows'),
            _.bind(function(row, callback) {
                new Vocab({id: row.vocabId}).fetch({
                    data: options.data,
                    error: function(error) {
                        callback(error);
                    },
                    success: function(model) {
                        vocabs.push(model);
                        callback();
                    }
                });
            }, this),
            _.bind(function(error) {
                this.set('vocabs', vocabs);
                if (error) {
                    if (typeof options.error === 'function') {
                        options.error(error);
                    }
                } else {
                    if (typeof options.success === 'function') {
                        options.success();
                    }
                }
            }, this)
        );
    }
});
