var SkritterCollection = require('base/skritter-collection');
var Review = require('models/review');

/**
 * @class Reviews
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @param {Array|Object} [models]
     * @param {Object} [options]
     * @constructor
     */
    initialize: function(models, options) {
        options = options || {};
        this.items = options.items;
        this.timeOffset = 0;
    },
    /**
     * @property model
     * @type {Review}
     */
    model: Review,
    /**
     * @property url
     * @type {String}
     */
    url: 'reviews',
    /**
     * @method add
     * @param {Object} models
     * @param {Object} [options]
     * @param {Function} [callback]
     */
    add: function(models, options, callback) {
        var updatedItems = [];
        models = _.isArray(models) ? models : [models];
        options = _.defaults(options || {}, {merge: true});
        for (var a = 0, lengthA = models.length; a < lengthA; a++) {
            var model = models[a];
            model.data = _.uniqBy(model.data, 'itemId');
            for (var b = 0, lengthB = model.data.length; b < lengthB; b++) {
                var modelData = model.data[b];
                var item = this.items.get(modelData.itemId);
                var submitTimeSeconds = Math.round(modelData.submitTime);
                modelData.actualInterval = item.get('last') ? submitTimeSeconds - item.get('last') : 0;
                modelData.newInterval = app.fn.interval.quantify(item.toJSON(), modelData.score);
                modelData.previousInterval = item.get('previousInterval') || 0;
                modelData.previousSuccess = item.get('previousSuccess') || false;
                if (app.isDevelopment()) {
                    console.log(
                        item.id,
                        'scheduled for',
                        moment.duration(modelData.newInterval, 'seconds').as('days'),
                        'days'
                    );
                }
                if (!this.get(model.id)) {
                    item.set({
                        changed: submitTimeSeconds,
                        last: submitTimeSeconds,
                        previousInterval: modelData.currentInterval,
                        reviews: item.get('reviews') + 1,
                        successes: modelData.score > 1 ? item.get('successes') + 1 : item.get('successes'),
                        timeStudied: item.get('timeStudied') + modelData.reviewTime
                    });
                }
                item.set({
                    interval: modelData.newInterval,
                    next: submitTimeSeconds + modelData.newInterval,
                    previousSuccess: modelData.score > 1
                });
                updatedItems.push(item);
            }
        }
        async.each(
            updatedItems,
            function(item, callback) {
                app.db.items
                    .put(item.toJSON())
                    .then(function() {
                        callback();
                    })
                    .catch(callback);
            },
            function(error) {
                if (typeof callback === 'function') {
                    callback(error);
                }
            }
        );
        return SkritterCollection.prototype.add.call(this, models, options);
    },
    /**
     * @method comparator
     * @param {Review} review
     * @return {String}
     */
    comparator: function(review) {
        return review.get('created');
    },
    /**
     * @method fetchReviewErrors
     * @param {Function} [callback]
     */
    fetchReviewErrors: function(callback) {
        $.ajax({
            url: app.getApiUrl() + 'reviews/errors',
            headers: app.user.session.getHeaders(),
            type: 'GET',
            data: {
                limit: 100,
                offset: moment().startOf('year').unix()
            },
            error: function(error) {
                console.error(error);
            },
            success: function(result) {
                console.log(result);
            }
        });
    },
    /**
     * @method post
     * @param {Object} [options]
     */
    post: function(options) {
        var self = this;
        options = _.defaults(options || {}, {async: true, skip: 0});
        if (this.state === 'standby') {
            this.state = 'posting';
            var reviews = this.slice(0, -options.skip || this.length);
            async.eachSeries(
                _.chunk(reviews, 20),
                function(chunk, callback) {
                    console.log('CHUNK:', chunk);
                    var data = _
                        .chain(chunk)
                        .map(function(review) {
                            return review.get('data');
                        })
                        .flatten()
                        .value();
                    $.ajax({
                        url: app.getApiUrl() + 'reviews?spaceItems=false',
                        async: options.async,
                        headers: app.user.session.getHeaders(),
                        type: 'POST',
                        data: JSON.stringify(data),
                        error: function(error) {
                            var items = _
                                .chain(error.responseJSON.errors)
                                .map('Item')
                                .without(undefined)
                                .value();
                            self.reroll(items);
                        },
                        success: function() {
                            self.remove(chunk);
                            callback();
                        }
                    });
                },
                function(error) {
                    self.state = 'standby';
                    if (error) {
                        console.error('REVIEW ERROR:', error);
                    } else {
                        console.log('REVIEWS POSTED:', reviews.length);
                    }
                }
            );
        }
    },
    /**
     * @method reroll
     * @param {Array|Object} items
     * @param {Function} [callback]
     */
    reroll: function(items, callback) {
        var updatedItems = [];
        var itemIds = _.isArray(items) ? _.map(items, 'id') : [items.id];
        this.items.add(items, {merge: true});
        for (var a = 0, lengthA = this.length; a < lengthA; a++) {
            var review = this.at(a);
            var reviewData = review.get('data');
            for (var b = 0, lengthB = reviewData.length; b < lengthB; b++) {
                var modelData = reviewData[b];
                if (itemIds.indexOf(modelData.itemId) > -1) {
                    var item = this.items.get(modelData.itemId);
                    var submitTimeSeconds = Math.round(modelData.submitTime);
                    modelData.actualInterval = item.get('last') ? submitTimeSeconds - item.get('last') : 0;
                    modelData.newInterval = app.fn.interval.quantify(item.toJSON(), modelData.score);
                    modelData.previousInterval = item.get('previousInterval') || 0;
                    modelData.previousSuccess = item.get('previousSuccess') || false;
                    item.set({
                        changed: submitTimeSeconds,
                        last: submitTimeSeconds,
                        interval: modelData.newInterval,
                        next: submitTimeSeconds + modelData.newInterval,
                        previousInterval: modelData.currentInterval,
                        previousSuccess: modelData.score > 1
                    });
                    updatedItems.push(item);
                }
            }
        }
        async.each(
            updatedItems,
            function(item, callback) {
                app.db.items
                    .put(item.toJSON())
                    .then(function() {
                        callback();
                    })
                    .catch(callback);
            },
            function(error) {
                if (typeof callback === 'function') {
                    callback(error);
                }
            }
        );
    }
});
