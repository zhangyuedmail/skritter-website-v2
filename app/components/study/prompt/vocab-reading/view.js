var GelatoComponent = require('gelato/component');

/**
 * @class StylePromptVocabReading
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
	/**
	 * @method initialize
	 * @param {Object} options
	 * @constructor
	 */
	initialize: function(options) {
		this.prompt = options.prompt;
	},
	/**
	 * @property events
	 * @type Object
	 */
	events: {
		'click .show-reading': 'handleClickShowReading'
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {StylePromptVocabReading}
	 */
	render: function() {
		this.renderTemplate();
		return this;
	},
	/**
	 * @method handleClickShowReading
	 * @param {Event} event
	 */
	handleClickShowReading: function(event) {
		event.preventDefault();
		var $reading = $(event.target).parent('.reading');
		var position = parseInt($reading.data('position'), 10);
		this.prompt.reviews.at(position).set('showReading', true);
		this.render();
	}
});
