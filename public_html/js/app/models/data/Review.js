/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class DataReview
     */
    var Review = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            originalItems: [],
            position: 1,
            reviews: []
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('reviews', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.get('position') === 1 ? true : false;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            var actualPosition = this.get('reviews').length === 1 ? 1 : this.get('reviews').length - 1;
            return this.get('position') === actualPosition ? true : false;
        },
        /**
         * @method next
         * @returns {Number}
         */
        next: function() {
            if (this.isLast())
                return this.get('position');
            return this.set('position', this.attributes.position + 1).get('position');
        },
        /**
         * @method originalItem
         * @returns {Object}
         */
        originalItem: function() {
            return this.get('originalItems').length === 1 ? this.get('originalItems')[0] : this.get('originalItems')[this.get('position')];
        },
        /**
         * @method previous
         * @returns {Number}
         */
        previous: function() {
            if (this.isFirst())
                return this.get('position');
            return this.set('position', this.attributes.position - 1).get('position');
        },
        /**
         * @method review
         * @param {Object} data
         * @returns {Object}
         */
        review: function(data) {
            var review = this.get('reviews').length === 1 ? this.get('reviews')[0] : this.get('reviews')[this.get('position')];
            if (data) {
                for (var key in data)
                    review[key] = data[key];
                this.trigger('change:reviews');
            }
            return review;
        }
    });

    return Review;
});