/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/schedule/ScheduleItem'
], function(BaseCollection, ScheduleItem) {
    /**
     * @class ScheduleItems
     * @extend BaseCollection
     */
    var ScheduleItems = BaseCollection.extend({
        /**
         * @property model
         * @type ScheduleItem
         */
        model: ScheduleItem
    });

    return ScheduleItems;
});