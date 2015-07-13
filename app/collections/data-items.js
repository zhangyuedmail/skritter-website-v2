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
        this.fetchingDaily = false;
        this.fetchingNext = false;
        this.ignoreBase = null;
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
     * @returns {Number}
     */
    comparator: function(item) {
        if (item.id.indexOf(this.ignoreBase) > -1) {
            return 0;
        }
        return -item.getReadiness(this.sorted);
    },
    /**
     * @method clearActive
     */
    clearActive: function() {
        for (var i = 0, length = this.length; i < length; i++) {
            this.at(i).unset('active', {silent: true});
        }
    },
    /**
     * @method fetchDaily
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetchDaily: function(callbackSuccess, callbackError) {
        var self = this;
        if (this.fetchingDaily) {
            if (typeof callbackSuccess === 'function') {
                callbackSuccess();
            }
        } else {
            (function next(cursor) {
                self.fetchingDaily = true;
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
                        self.fetchingDaily = false;
                        self.trigger('fetch:daily', self);
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess();
                        }
                    }
                }, function(error) {
                    self.fetchingDaily = false;
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                });
            })();
        }
    },
    /**
     * @method fetchNext
     * @param {Object} [options]
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    fetchNext: function(options, callbackSuccess, callbackError) {
        var self = this;
        var counter = 0;
        options = options || {};
        if (this.fetchingNext) {
            if (typeof callbackSuccess === 'function') {
                callbackSuccess();
            }
        } else {
            (function next(cursor) {
                self.fetchingNext = true;
                app.api.fetchItems({
                    cursor: cursor,
                    ids: 'mcfarljwtest1-zh-你好-0-rune',
                    include_contained: true,
                    include_decomps: true,
                    include_sentences: true,
                    include_strokes: true,
                    include_top_mnemonics: true,
                    include_vocabs: true,
                    lang: app.get('language'),
                    limit: 5,
                    parts: options.parts,
                    sort: 'next',
                    styles: options.styles
                }, function(result) {
                    app.user.data.add(result);
                    self.markActive(result.Items);
                    self.trigger('fetch:next', self);
                    if (counter < 5 && result.cursor) {
                        counter++;
                        next(result.cursor);
                    } else {
                        self.fetchingNext = false;
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess();
                        }
                    }
                }, function(error) {
                    self.fetchingNext = false;
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                });
            })();
        }
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
     * @method getLast
     * @returns {ScheduleItem}
     */
    getLast: function() {
        return _.sortBy(this.models, function(item) {
            return -item.get('last');
        })[0];
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
            return item.get('last') >= today;
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
     * @method addActive
     * @param {Array} items
     */
    markActive: function(items) {
        for (var i = 0, length = items.length; i < length; i++) {
            this.get(items[i].id).set('active', true, {silent: true});
        }
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
        this.ignoreBase = this.getLast() ? this.getLast().getBaseWriting() : null;
        this.sorted = moment().unix();
        return GelatoCollection.prototype.sort.call(this);
    }
});
