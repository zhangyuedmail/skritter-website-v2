var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptToolbarGrading
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
		'vmousedown button': 'handleMousedownButton',
		'vmouseup button': 'handleMouseupButton'
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @property value
	 * @type {Number}
	 */
	value: null,
	/**
	 * @method render
	 * @returns {StudyPromptToolbarGrading}
	 */
	render: function() {
		this.renderTemplate();
		return this;
	},
	/**
	 * @method deselect
	 * @returns {StudyPromptToolbarGrading}
	 */
	deselect: function() {
		this.value = null;
		return this.render();
	},
	/**
	 * @method handleMousedownButton
	 * @param {Event} event
	 */
	handleMousedownButton: function(event) {
		event.preventDefault();
		this.select($(event.currentTarget).data('value'));
		this.trigger('mousedown', this.value);
	},
	/**
	 * @method handleMousedownButton
	 * @param {Event} event
	 */
	handleMouseupButton: function(event) {
		event.preventDefault();
		this.select($(event.currentTarget).data('value'));
		this.trigger('mouseup', this.value);
	},
	/**
	 * @method select
	 * @param {Number} value
	 * @returns {StudyPromptToolbarGrading}
	 */
	select: function(value) {
		this.value = parseInt(value, 10);
		return this.render();
	}
});
