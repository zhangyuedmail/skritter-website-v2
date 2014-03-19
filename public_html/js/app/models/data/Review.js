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
            this.characters = null;
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
         * @method at
         * @param {Object} data
         * @returns {Object}
         */
        at: function(data) {
            var review = this.get('reviews').length === 1 ? this.get('reviews')[0] : this.get('reviews')[this.get('position')];
            if (data) {
                for (var key in data)
                    review[key] = data[key];
                this.trigger('change:reviews');
            }
            return review;
        },
        /**
         * @method baseItem
         * @returns {Backbone.Model}
         */
        baseItem: function() {
            return skritter.user.data.items.get(this.get('reviews')[0].itemId);
        },
        /**
         * @method baseVocab
         * @returns {Backbone.Model}
         */
        baseVocab: function() {
            return this.baseItem().vocab();
        },
        /**
         * @method character
         * @returns {Backbone.Collection}
         */
        character: function() {
            return this.characters && this.hasContained() ? this.characters[this.get('position') - 1] : this.characters[0];
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            return this.get('reviews').length > 1 ? true : false;
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
         * @method item
         * @returns {Backbone.Model}
         */
        item: function() {
            var position = this.hasContained() ? this.get('position') : 0;
            return skritter.user.data.items.get(this.get('reviews')[position].itemId);
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
         * @method vocab
         * @returns {Backbone.Model}
         */
        vocab: function() {
            return this.item().vocab();
        }
    });

    return Review;
});