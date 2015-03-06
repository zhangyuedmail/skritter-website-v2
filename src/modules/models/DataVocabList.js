/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataVocabList
     * @extends GelatoModel
     */
    var DataVocabList = GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id'
    });

    return DataVocabList;

});