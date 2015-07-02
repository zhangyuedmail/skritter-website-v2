var GelatoCollection = require('gelato/modules/collection');
var ScheduleItem = require('models/schedule-item');

/**
 * @class HistoryItems
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property model
     * @type {ScheduleItem}
     */
    model: ScheduleItem
});
