var SkritterModel = require('base/skritter-model');

/**
 * @class Cancellation
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
	urlRoot: 'cancellation',
	/**
	 * @method parse
	 * @returns {Object}
	 */
	parse: function(response) {
		return response.Cancellation || response;
	}
});
