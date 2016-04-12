var GelatoModel = require('gelato/model');

/**
 * @class ProgressStat
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
	/**
	 * @method initialize
	 * @constructor
	 */
	initialize: function () {
	},
	/**
	 * @property idAttribute
	 * @type {String}
	 */
	idAttribute: 'date',
	/**
	 * @method getStudiedCount
	 * @returns {Number}
	 */
	getStudiedCount: function () {
		var count = 0;
		count += this.get('char').defn.studied.day;
		count += this.get('char').rdng.studied.day;
		count += this.get('char').rune.studied.day;
		count += this.get('char').tone.studied.day;
		count += this.get('word').defn.studied.day;
		count += this.get('word').rdng.studied.day;
		count += this.get('word').rune.studied.day;
		count += this.get('word').tone.studied.day;
		return count;
	},
	/**
	 * @method hasBeenStudied
	 * @returns {Boolean}
	 */
	hasBeenStudied: function () {
		return this.getStudiedCount() > 0;
	}
});
