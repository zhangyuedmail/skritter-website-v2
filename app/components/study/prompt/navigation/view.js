var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptNavigation
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
		this.reviews = null;
		this.showLeft = true;
		this.showRight = true;
	},
	/**
	 * @property events
	 * @type Object
	 */
	events: {
		'click #navigate-next': 'handleClickNavigateNext',
		'click #navigate-previous': 'handleClickNavigatePrevious'
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {StudyPromptNavigation}
	 */
	render: function () {
		this.renderTemplate();
		return this;
	},
	/**
	 * @method handleClickNavigateNext
	 * @param {Event} event
	 */
	handleClickNavigateNext: function (event) {
		event.preventDefault();
		this.prompt.next();
	},
	/**
	 * @method handleClickNavigatePrevious
	 * @param {Event} event
	 */
	handleClickNavigatePrevious: function (event) {
		event.preventDefault();
		this.prompt.previous();
	},
	/**
	 * @method setReviews
	 * @param {Reviews} reviews
	 */
	setReviews: function (reviews) {
		this.stopListening();
		this.listenTo(reviews, 'add', this.render);
		this.listenTo(reviews, 'state', this.render);
		this.reviews = reviews;
		return this.render();
	}
});
