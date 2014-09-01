/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class ScheduleItem
     * @extends BaseModel
     */
    var ScheduleItem = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id'
    });

    return ScheduleItem;
});