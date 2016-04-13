var GelatoModel = require('gelato/model');

/**
 * @class StrokeShape
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
	/**
	 * @property idAttribute
	 * @type {String}
	 */
	idAttribute: 'id',
	/**
	 * @method defaults
	 * @returns {Object}
	 */
	defaults: function() {
		return {
			contains: [],
			corners: [],
			strokeId: undefined
		};
	}
});
