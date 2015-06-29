/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataSentence'
], function(GelatoCollection, DataSentence) {

    /**
     * @class DataSentences
     * @extends GelatoCollection
     */
    var DataSentences = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property model
         * @type DataSentence
         */
        model: DataSentence
    });

    return DataSentences;

});