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
     * @return {Array|Review}
     */
    add: function(models, options) {
        models = _.isArray(models) ? models : [models];
        options = _.defaults(options || {}, {merge: true});
        for (var a = 0, lengthA = models.length; a < lengthA; a++) {
            var model = models[a];
            for (var b = 0, lengthB = model.data.length; b < lengthB; b++) {
                var modelData = model.data[b];
                var item = this.items.get(modelData.itemId);
                modelData.actualInterval = item.get('last') ? modelData.submitTimeSeconds - item.get('last') : 0;
                modelData.currentInterval = item.get('interval') || 0;
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
                item.set({
                    changed: modelData.submitTimeSeconds,
                    last: modelData.submitTimeSeconds,
                    interval: modelData.newInterval,
                    next: modelData.submitTimeSeconds + modelData.newInterval,
                    previousInterval: modelData.currentInterval,
                    previousSuccess: modelData.score > 1
                });
                if (!this.get(model.id)) {
                    item.set({
                        reviews: item.get('reviews') + 1,
                        successes: modelData.score > 1 ? item.get('successes') + 1 : item.get('successes'),
                        timeStudied: item.get('timeStudied') + modelData.reviewTime
                    });
                }
            }
        }
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
                    data = _
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
                            callback(error);
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
                        console.log('REVIEW ERROR:', error);
                    } else {
                        console.log('REVIEWS POSTED:', reviews.length);
                    }
                }
            );
        }
    }
});
