/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataStroke
     * @extends BaseModel
     */
    return BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'rune'
    });
});
