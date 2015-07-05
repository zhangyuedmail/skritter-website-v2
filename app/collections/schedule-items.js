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
    initialize: function() {
        this.sorted = moment().unix();
        this.syncing = false;
    },
    /**
     * @property model
     * @type {ScheduleItem}
     */
    model: ScheduleItem,
    /**
     * @method comparator
     * @param {DataItem} item
     */
    comparator: function(item) {
        return -item.getReadiness(this.sorted);
    },
    /**
     * @method fetch
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetch: function(callbackSuccess, callbackError) {
        var self = this;
        var counter = 0;
        (function next(cursor) {
            self.syncing = true;
            app.api.fetchItems({
                cursor: cursor,
                include_contained: true,
                include_decomps: true,
                include_sentences: true,
                include_strokes: true,
                include_top_mnemonics: true,
                include_vocabs: true,
                lang: app.get('language'),
                limit: 5,
                sort: 'next'
            }, function(result) {
                app.user.data.add(result);
                self.trigger('update', self);
                if (counter < 5 && result.cursor) {
                    counter++;
                    next(result.cursor);
                } else {
                    self.syncing = false;
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            }, function(error) {
                self.syncing = false;
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        })();
    },
    /**
     * @method getNext
     * @returns {ScheduleItem}
     */
    getNext: function() {
        return this.sort().at(0);
    },
    /**
     * @method printNext
     * @returns {ScheduleItems}
     */
    printNext: function() {
        this.sort();
        console.log('---', 'SCHEDULED ITEMS', '---');
        for (var i = 0, length = 5; i < length; i ++) {
            var item = this.at(i);
            console.log(item.id, item.getReadiness(this.sorted));
        }
        return this;
    },
    /**
     * @method sort
     * @returns {Array}
     */
    sort: function() {
        this.sorted = moment().unix();
        return GelatoCollection.prototype.sort.call(this);
    }
});
