/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class PromptStroke
     * @extends BaseModel
     */
    var PromptStroke = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id'
    });

    return PromptStroke;
});
