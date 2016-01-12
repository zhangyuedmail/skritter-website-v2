var SkritterCollection = require('base/skritter-collection');
var Review = require('models/review');

/**
 * @class Reviews
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
    /**
     * @method initialize
     * @param {Object} [options]
     * @constructor
     */
    initialize: function(options) {
        options = options || {};
        this.items = options.items;
        this.timeOffset = 0;
    },
    /**
     * @method comparator
     * @param {Review} review
     * @return {String}
     */
    comparator: function(review) {
        return -review.get('timestamp');
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
    post: function(startFrom) {
        if (this.state === 'standby') {
            this.state = 'posting';
            this.sort();
            var reviews = this.toJSON().slice(startFrom || 0);
            var chunks = _.chunk(reviews, 200);
            async.eachSeries(
                chunks,
                _.bind(function(chunk, callback) {
                    var data = chunk.map(function(review) {
                        return review.data;
                    });
                    $.ajax({
                        url: app.getApiUrl() + 'reviews?spaceItems=false',
                        headers: app.user.session.getHeaders(),
                        context: this,
                        type: 'POST',
                        data: JSON.stringify(_.flatten(data)),
                        error: function(error) {
                            callback(error);
                        },
                        success: function() {
                            for (var i = 0, length = data.length; i < length; i ++) {
                                this.timeOffset += data[i][0].reviewTime;
                            }
                            this.remove(chunk);
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
