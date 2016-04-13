var GelatoCollection = require('gelato/collection');
var Review = require('test/models/review');

var Reviews = GelatoCollection.extend(/** @lends Reviews.prototype */ {
	/**
	 * @class Reviews
	 * @param {Array|Object} [models]
	 * @param {Object} [options]
	 * @augments {GelatoCollection}
	 */
	initialize: function(models, options) {
		this.items = options.items;
	},
	/**
	 * @param {Review} review
	 * @return {String}
	 */
	comparator: function(review) {
		return review.get('created');
	},
	/**
	 * @property {Review}
	 */
	model: Review,
	/**
	 * @property {String}
	 */
	url: 'reviews'
});

module.exports = Reviews;
