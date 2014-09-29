/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataSentence
     * @extends BaseModel
     */
    var DataSentence = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id'
    });

    return DataSentence;
});
