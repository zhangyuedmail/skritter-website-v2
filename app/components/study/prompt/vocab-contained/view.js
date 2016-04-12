var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabContained
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
	/**
	 * @method initialize
	 * @param {Object} options
	 * @constructor
	 */
	initialize: function (options) {
		this.prompt = options.prompt;
	},
	/**
	 * @property events
	 * @type Object
	 */
	events: {
		'click #show-contained': 'handleClickShowContained'
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {StudyPromptVocabContained}
	 */
	render: function () {
		this.renderTemplate();
		return this;
	},
	/**
	 * @method handleClickShowContained
	 * @param {Event} event
	 */
	handleClickShowContained: function (event) {
		event.preventDefault();
		this.prompt.review.set('showContained', true);
		this.render();
	}
});
