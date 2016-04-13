var GelatoComponent = require('gelato/component');

/**
 * @class MarketingFloor
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {GelatoComponent}
	 */
	render: function() {
		this.renderTemplate();
		return this;
	}
});
