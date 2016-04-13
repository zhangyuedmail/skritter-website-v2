var SkritterModel = require('base/skritter-model');

/**
 * @class ChinesePodSession
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
	/**
	 * @property idAttribute
	 * @type {String}
	 */
	idAttribute: 'id',
	/**
	 * @method urlRoot
	 * @returns {String}
	 */
	url: 'cpod/login',
	/**
	 * @method parse
	 * @returns {Object}
	 */
	parse: function(response) {
		return response.ChinesePodSession || response;
	}
});
