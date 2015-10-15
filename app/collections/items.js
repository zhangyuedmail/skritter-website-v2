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
        this.history = [];
        this.sorted = null;
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
     * @method comparator
     * @param {Item} item
     * @return {Number}
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
        this.contained.add(response.ContainedItems);
        this.vocabs.add(response.Vocabs);
        this.vocabs.decomps.add(response.Decomps);
        this.vocabs.sentences.add(response.Sentences);
        this.vocabs.strokes.add(response.Strokes);
        return response.Items;
    },
    /**
     * @method sort
     * @returns {Items}
     */
    sort: function() {
        this.sorted = moment().unix();
        return SkritterCollection.prototype.sort.call(this);
    },
    /**
     * @property url
     * @type {String}
     */
    url: 'items',
    /**
     * @method add
     * @param {Object} [lists]
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    add: function(lists, callbackSuccess, callbackError) {
        var offset = app.user.get('addItemOffset');
        var params = '?offset=' + offset;
        if (lists) {
            params += '&lists=' + lists;
        }
        async.waterfall([
            _.bind(function(callback) {
                this.fetch({
                    remove: false,
                    sort: false,
                    type: 'POST',
                    url: app.getApiUrl() + 'items/add' + params,
                    error: function(error) {
                        callback(error);
                    },
                    success: function(items, result) {
                        result.offset = offset + result.numVocabsAdded;
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
                    sort: true,
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
                typeof callbackError === 'function' && callbackError(error);
            } else {
                app.user.set('addItemOffset', result.offset).cache();
                typeof callbackSuccess === 'function' && callbackSuccess(result);
            }
        });
    },
    /**
     * @method addHistory
     * @param {String} base
     */
    addHistory: function(base) {
        if (this.history.length > 2) {
            this.history.pop();
        }
        this.history.unshift(base);
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
            if (i === 0) {
                this.addHistory(item.getBase());
            }
        }
        this.reviews.add(reviews);
    },
    /**
     * @method getNext
     * @returns {Items}
     */
    getNext: function() {
        return this.sort().at(0);
    },
    /**
     * @method logNext
     */
    logNext: function() {
        for (var i = 0, length = this.sort().length; i < length; i++) {
            var item = this.at(i);
            console.log(item.id, item.getReadiness());
        }
    }
});
