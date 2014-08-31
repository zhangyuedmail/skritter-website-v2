/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataVocabList
     * @extends BaseModel
     */
    var DataVocabList = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id'
    });

    return DataVocabList;
});
