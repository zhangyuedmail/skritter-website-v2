/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataVocab'
], function(BaseCollection, DataVocab) {
    /**
     * @class DataVocabs
     * @extend BaseCollection
     */
    var DataVocabs = BaseCollection.extend({
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab
    });

    return DataVocabs;
});
