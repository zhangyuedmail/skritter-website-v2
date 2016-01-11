var SkritterCollection = require('base/skritter-collection');
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
            var item = this.get(review.itemId);
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
     * @method parse
     * @param {Object} response
     * @returns {Object}
     */
    parse: function(response) {
        this.cursor = response.cursor;
        this.vocabs.add(response.Vocabs);
        this.vocabs.decomps.add(response.Decomps);
        this.vocabs.sentences.add(response.Sentences);
        this.vocabs.strokes.add(response.Strokes);
        return response.Items.concat(response.ContainedItems || []);
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
