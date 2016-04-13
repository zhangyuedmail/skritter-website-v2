var GelatoCollection = require('gelato/collection');
var StrokeParam = require('models/stroke-param');
var ParamData = require('data/param-data');

/**
 * @class StrokeParams
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
	/**
	 * @method initialize
	 * @constructor
	 */
	initialize: function() {
		this.add(ParamData.getData());
	},
	/**
	 * @property model
	 * @type {StrokeParam}
	 */
	model: StrokeParam
});
