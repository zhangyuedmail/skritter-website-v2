var GelatoCollection = require('gelato/modules/collection');
var HistoryItem = require('models/history-item');

/**
 * @class ScheduleItems
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
     * @type {HistoryItems}
     */
    model: HistoryItem
});
