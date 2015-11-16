var SkritterCollection = require('base/skritter-collection');
var Review = require('models/review');

/**
 * @class Reviews
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.timeOffset = 0;
    },
    /**
     * @method comparator
     * @param {Review} review
     * @return {String}
     */
    comparator: function(review) {
        return review.id;
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
     * @method post
     */
    post: function() {
        if (this.state === 'standby') {
            var reviews = this.toJSON();
            this.state = 'posting';
            async.eachSeries(
                reviews,
                _.bind(function(review, callback) {
                    $.ajax({
                        url: app.getApiUrl() + 'reviews?spaceItems=false',
                        headers: app.user.session.getHeaders(),
                        context: this,
                        type: 'POST',
                        data: JSON.stringify(review.data),
                        error: function(error) {
                            callback(error);
                        },
                        success: function() {
                            this.timeOffset += review.data[0].reviewTime;
                            this.remove(review);
                            callback();
                        }
                    });
                }, this),
                _.bind(function(error) {
                    this.state = 'standby';
                    if (error) {
                        console.log('REVIEW ERROR:', error);
                    } else {
                        console.log('REVIEWS POSTED:', reviews.length);
                    }
                }, this)
            );
        }
    }
});
