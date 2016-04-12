var GelatoComponent = require('gelato/component');

var Vocab = require('models/vocab');

/**
 * @class VocablistsListEditorSections
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
	/**
	 * @method initialize
	 * @param {Object} options
	 * @constructor
	 */
	initialize: function (options) {
		this.editing = false;
		this.vocablist = options.vocablist;
		this.listenTo(this.vocablist, 'change:sections', this.render);
		this.listenTo(this.vocablistSection, 'change:vocabs', this.render);
	},
	/**
	 * @property events
	 * @type {Object}
	 */
	events: {
		'click #restore-section': 'handleClickRestoreSection',
		'click #remove-section': 'handleClickRemoveSection',
		'keyup .last-section': 'handleKeyupLastSection'
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {VocablistsListEditorSections}
	 */
	render: function () {
		this.renderTemplate();
		return this;
	},
	/**
	 * @method addSection
	 * @param {String} [name]
	 */
	addSection: function (name) {
		this.vocablist.get('sections').push({name: name, rows: []});
		this.render().$('.last-section').find('input').focus();
	},
	/**
	 * @method handleClickRemoveSection
	 * @param {Event} event
	 */
	handleClickRemoveSection: function (event) {
		event.preventDefault();
		var $row = $(event.target).closest('.row');
		this.vocablist.get('sections')[$row.data('index')].deleted = true;
		this.render();
	},
	/**
	 * @method handleClickRestoreSection
	 * @param {Event} event
	 */
	handleClickRestoreSection: function (event) {
		event.preventDefault();
		var $row = $(event.target).closest('.row');
		this.vocablist.get('sections')[$row.data('index')].deleted = false;
		this.render();
	},
	/**
	 * @method handleKeyupLastSection
	 * @param {Event} event
	 */
	handleKeyupLastSection: function (event) {
		event.preventDefault();
		if (event.which === 13 || event.keyCode === 13) {
			if (!this.vocablist.get('singleSect')) {
				this.updateVocablist();
				this.addSection();
			}
		}
	},
	/**
	 * @method updateVocablist
	 */
	updateVocablist: function () {
		this.$('#vocablist-sections')
			.children('.row')
			.each((function (index, element) {
				var name = $(element).find('#section-name').val();
				var section = this.vocablist.get('sections')[index];
				section.name = name;
			}).bind(this));
	}
});
