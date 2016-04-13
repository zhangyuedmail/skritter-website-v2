var CancellationReason = require('models/cancellation-reason');
var SkritterCollection = require('base/skritter-collection');

/**
 * @class CancellationReasons
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
	/**
	 * @property comparator
	 */
	comparator: 'priority',
	/**
	 * @method initialize
	 * @constructor
	 */
	initialize: function() {
	},
	/**
	 * @property model
	 * @type {Model}
	 */
	model: CancellationReason,
	/**
	 * @method parse
	 * @param {Object} response
	 * @returns Array
	 */
	parse: function(response) {
		return response.CancellationReasons;
	},
	/**
	 * @property url
	 * @type {String}
	 */
	url: 'cancellationreason'
});
