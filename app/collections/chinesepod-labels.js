var ChinesePodLabel = require('models/chinesepod-label');
var SkritterCollection = require('base/skritter-collection');

/**
 * @class ChinesePodLabels
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
	/**
	 * @property model
	 * @type {Vocablist}
	 */
	model: ChinesePodLabel,
	/**
	 * @method parse
	 * @param {Object} response
	 * @returns Array
	 */
	parse: function(response) {
		return response.ChinesePodLists;
	},
	/**
	 * @property url
	 * @type {String}
	 */
	url: 'cpod/labels'
});
