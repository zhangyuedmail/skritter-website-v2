var GelatoCollection = require('gelato/modules/collection');
var DataItem = require('models/data-item');

/**
 * @class DataItems
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.scheduled = [];
        this.sorted = moment().unix();
    },
    /**
     * @property model
     * @type {DataItem}
     */
    model: DataItem,
    /**
     * @method comparator
     * @param {DataItem} item
     */
    comparator: function(item) {
        return -item.getReadiness(this.sorted);
    },
    /**
     * @method fetchDaily
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetchDaily: function(callbackSuccess, callbackError) {
        var self = this;
        (function next(cursor) {
            app.api.fetchItems({
                cursor: cursor,
                lang: app.get('language'),
                offset: moment().startOf('day').add(3, 'hours').unix(),
                sort: 'changed'
            }, function(result) {
                app.user.data.add(result);
                if (result.cursor) {
                    next(result.cursor);
                } else {
                    self.trigger('fetch:daily', self);
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        })();
    },
    /**
     * @method fetchNext
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetchNext: function(callbackSuccess, callbackError) {
        var self = this;
        var counter = 0;
        (function next(cursor) {
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
                for (var i = 0, length = result.Items.length; i < length; i++) {
                    result.Items[i].active = true;
                }
                app.user.data.add(result);
                self.trigger('fetch:next', self);
                if (counter < 0 && result.cursor) {
                    counter++;
                    next(result.cursor);
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        })();
    },
    /**
     * @method getItemAddedCount
     * @returns {Number}
     */
    getAddedCount: function() {
        var today = moment().startOf('day').add(3, 'hours').unix();
        return _.filter(this.models, function(item) {
            return item.get('created') >= today;
        }).length;
    },
    /**
     * @method getNext
     * @returns {ScheduleItem}
     */
    getNext: function() {
        return this.sort().at(0);
    },
    /**
     * @method getItemReviewedCount
     * @returns {Number}
     */
    getReviewedCount: function() {
        var today = moment().startOf('day').add(3, 'hours').unix();
        return _.filter(this.models, function(item) {
            return item.attributes.last >= today;
        }).length;
    },
    /**
     * @method getSchedule
     * @returns {Array}
     */
    getSchedule: function() {
        return this.sort().filter(function(item) {
            return item.get('active');
        });
    },
    /**
     * @method printNext
     * @returns {ScheduleItems}
     */
    printNext: function() {
        var schedule = this.getSchedule();
        console.log('---', 'SCHEDULED ITEMS', '---');
        for (var i = 0, length = schedule.length; i < length; i ++) {
            var item = schedule[i];
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
