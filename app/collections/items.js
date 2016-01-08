var SkritterCollection = require('base/skritter-collection');
var ContainedItems = require('collections/contained-items');
var Reviews = require('collections/reviews');
var Vocabs = require('collections/vocabs');
var Item = require('models/item');

/**
 * @class Items
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.cursor = null;
        this.sorted = null;
        this.queue = [];
        this.contained = new ContainedItems();
        this.reviews = new Reviews();
        this.vocabs = new Vocabs();
    },
    /**
     * @property model
     * @type {Item}
     */
    model: Item,
    /**
     * @property url
     * @type {String}
     */
    url: 'items',
    /**
     * @method addItems
     * @param {Object} [options]
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    addItems: function(options, callbackSuccess, callbackError) {
        async.waterfall([
            _.bind(function(callback) {
                this.fetch({
                    data: JSON.stringify(options),
                    remove: false,
                    sort: false,
                    type: 'POST',
                    url: app.getApiUrl() + 'items/add',
                    error: function(error) {
                        callback(error);
                    },
                    success: function(items, result) {
                        callback(null, result);
                    }
                });
            }, this),
            _.bind(function(result, callback) {
                this.fetch({
                    data: {
                        ids: _.pluck(result.Items, 'id').join('|'),
                        include_contained: true,
                        include_decomps: true,
                        include_sentences: true,
                        include_strokes: true,
                        include_vocabs: true
                    },
                    remove: false,
                    sort: false,
                    error: function(error) {
                        callback(error);
                    },
                    success: function() {
                        callback(null, result);
                    }
                });
            }, this)
        ], function(error, result) {
            if (error) {
                console.error('ITEM ADD ERROR:', error);
                callbackError(error)
            } else {
                callbackSuccess(result);
            }
        });
    },
    /**
     * @method addReviews
     * @param {Array} reviews
     */
    addReviews: function(reviews) {
        for (var i = 0, length = reviews.data.length; i < length; i++) {
            var review = reviews.data[i];
            var item = this.get(review.itemId) || this.contained.get(review.itemId);
            review.actualInterval = item.get('last') ? review.submitTime - item.get('last') : 0;
            review.currentInterval = item.get('interval') || 0;
            review.newInterval = app.fn.interval.quantify(item, review.score);
            review.previousInterval = item.get('previousInterval') || 0;
            review.previousSuccess = item.get('previousSuccess') || false;
            if (i === 0) {
                if (item.consecutiveWrong >= 2) {
                    item.consecutiveWrong = 0;
                } else {
                    item.consecutiveWrong = review.score > 1 ? 0 : item.consecutiveWrong + 1;
                }
            }
            if (app.isDevelopment()) {
                console.log(
                    item.id,
                    'scheduled for',
                    moment.duration(review.newInterval, 'seconds').as('days'),
                    'days'
                );
            }
            item.set({
                changed: review.submitTime,
                last: review.submitTime,
                interval: review.newInterval,
                next: review.submitTime + review.newInterval,
                previousInterval: review.currentInterval,
                previousSuccess: review.score > 1,
                reviews: item.get('reviews') + 1,
                successes: review.score > 1 ? item.get('successes') + 1 : item.get('successes'),
                timeStudied: item.get('timeStudied') + review.reviewTime
            });
        }
        this.reviews.add(reviews);
    },
    /**
     * @method comparator
     * @param {Item} item
     * @returns {Number}
     */
    comparator: function(item) {
        return -item.getReadiness();
    },
    /**
     * @method populateQueue
     */
    populateQueue: function() {
        var self = this;
        var items = [];
        //store base histories for better spacing
        var localHistory = [];
        var queueHistory = this.queue.map(function(item) {
            return item.getBase();
        });
        //creates an array items to queue
        for (var i = 0, length = this.sort().length; i < length; i++) {
            var item = this.at(i);
            var itemBase = item.getBase();
            if (items.length < 10) {
                if (localHistory.indexOf(itemBase) === -1 &&
                    queueHistory.indexOf(itemBase) === -1) {
                    localHistory.push(itemBase);
                    items.push(item);
                }
            } else {
                break;
            }
        }
        //fetch resource data for queue items
        this.fetch({
            data: {
                ids: _.pluck(items, 'id').join('|'),
                include_contained: true,
                include_decomps: true,
                include_sentences: true,
                include_strokes: true,
                include_vocabs: true
            },
            merge: true,
            remove: false,
            error: function(items, error) {
                self.trigger('queue:error', error, items);
                if (typeof callback === 'function') {
                    callback(error, self);
                }
            },
            success: function(items, result) {
                var now = moment().unix();
                var sortedItems = _.sortBy(result.Items, function(item) {
                    var readiness = 0;
                    if (!item.last) {
                        readiness = 9999;
                    } else {
                        readiness = (now - item.last) / (item.next - item.last);
                    }
                    return -readiness;
                });
                for (var i = 0, length = sortedItems.length; i < length; i++) {
                    self.queue.push(self.get(sortedItems[i].id));
                }
                self.trigger('queue:populate', self);
                if (typeof callback === 'function') {
                    callback(null, items);
                }
            }
        });
    },
    /**
     * @method loadQueue
     */
    loadQueue: function() {
        var self = this;
        var parts = app.user.getStudyParts();
        var styles = app.user.getStudyStyles();
        app.db.items
            .toArray()
            .then(function(items) {
                items = items.filter(function(item) {
                    if (!item.vocabIds.length) {
                        return false;
                    } else if (parts.indexOf(item.part) === -1) {
                        return false;
                    } else if (styles.indexOf(item.style) === -1) {
                        return false;
                    }
                    return true;
                });
                self.set(items.splice(0, 1000));
                self.trigger('queue:load', self);
                self.populateQueue();
            })
            .catch(function(error) {
                self.trigger('queue:error', error);
            });
    },
    /**
     * @method parse
     * @param {Object} response
     * @returns {Object}
     */
    parse: function(response) {
        this.cursor = response.cursor;
        this.contained.add(response.ContainedItems, {merge: true});
        this.vocabs.add(response.Vocabs, {merge: true});
        this.vocabs.decomps.add(response.Decomps, {merge: true});
        this.vocabs.sentences.add(response.Sentences, {merge: true});
        this.vocabs.strokes.add(response.Strokes, {merge: true});
        return response.Items;
    },
    /**
     * @method sort
     * @returns {Items}
     */
    sort: function() {
        this.sorted = moment().unix();
        return SkritterCollection.prototype.sort.call(this);
    }
});
