var SkritterModel = require('base/skritter-model');

/**
 * @class CancellationReason
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
	/**
	 * @method initialize
	 * @constructor
	 */
	initialize: function() {
	},
	/**
	 * @property idAttribute
	 * @type {String}
	 */
	idAttribute: 'id',
	/**
	 * @property urlRoot
	 */
	urlRoot: 'cancellationreason',
	/**
	 * @method parse
	 * @returns {Object}
	 */
	parse: function(response) {
		return response.CancellationReason || response;
	}
});
