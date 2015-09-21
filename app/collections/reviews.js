var SkritterCollection = require('base/skritter-collection');
var Review = require('models/review');

/**
 * @class Reviews
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
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
     * @method save
     */
    save: function() {
        if (this.state === 'standby') {
            this.state = 'saving';
            async.eachSeries(
                this.toJSON(),
                _.bind(function(review, callback) {
                    $.ajax({
                        url: app.getApiUrl() + 'reviews?spaceItems=false',
                        headers: app.user.session.getHeaders(),
                        context: this,
                        type: 'POST',
                        data: JSON.stringify(review.data)
                    }).done(function() {
                        this.remove(review);
                        callback();
                    }).fail(function(error) {
                        //TODO: better handle conflicts
                        callback(error);
                    });
                }, this),
                _.bind(function(error) {
                    this.state = 'standby';
                    if (error) {
                        console.log('REVIEW ERROR:', error);
                    } else {
                        this.reset();
                    }
                }, this)
            );
        }
    }
});
