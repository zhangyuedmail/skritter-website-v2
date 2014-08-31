/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataDecomp
     * @extends BaseModel
     */
    var DataDecomp = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'writing'
    });

    return DataDecomp;
});
