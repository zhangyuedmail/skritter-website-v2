var GelatoCollection = require('gelato/collection');
var PromptReview = require('models/prompt-review');

/**
 * @class PromptReviews
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.position = 0;
    },
    /**
     * @property model
     * @type {PromptReview}
     */
    model: PromptReview,
    /**
     * @method getPosition
     * @returns {PromptReview}
     */
    getActive: function() {
        return this.at(this.position);
    },
    /**
     * @method getPosition
     * @returns {Number}
     */
    getPosition: function() {
        return this.position;
    },
    /**
     * @method isComplete
     * @returns {Boolean}
     */
    isComplete: function() {
        return this.pluck('complete').indexOf(false) === -1;
    },
    /**
     * @method isFirst
     * @returns {Boolean}
     */
    isFirst: function() {
        return this.getPosition() === 0;
    },
    /**
     * @method isLast
     * @returns {Boolean}
     */
    isLast: function() {
        return this.getPosition() >= this.length;
    },
    /**
     * @method maskAllReadings
     */
    maskAllReadings: function() {
        this.each(function(review) {
            review.set('maskReading', true);
        });
    },
    /**
     * @method maskAllWritings
     */
    maskAllWritings: function() {
        this.each(function(review) {
            review.set('maskWriting', true);
        });
    },
    /**
     * @method next
     * @returns {PromptReview}
     */
    next: function() {
        if (!this.isLast()) {
            this.setPosition(this.position + 1);
        }
        return this.getActive();
    },
    /**
     * @method previous
     * @returns {PromptReview}
     */
    previous: function() {
        if (!this.isFirst()) {
            this.setPosition(this.position - 1);
        }
        return this.getActive();
    },
    /**
     * @method setPosition
     * @param {Number} value
     * @returns {Number}
     */
    setPosition: function(value) {
        this.position = value;
        this.trigger('change:position', this);
        this.trigger('change', this);
        return this.position;
    },
    /**
     * @method unmaskAllReadings
     */
    unmaskAllReadings: function() {
        this.each(function(review) {
            review.set('maskReading', false);
        });
    },
    /**
     * @method unmaskAllWritings
     */
    unmaskAllWritings: function() {
        this.each(function(review) {
            review.set('maskWriting', false);
        });
    }
});