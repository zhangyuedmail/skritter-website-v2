var GelatoComponent = require('gelato/component');

var VocabViewerLookup = require('dialogs1/vocab-viewer/lookup/view');

/**
 * @class VocabViewerContent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
	/**
	 * @method initialize
	 * @param {Object} [options]
	 * @constructor
	 */
	initialize: function(options) {
		this.lookup = new VocabViewerLookup();
		this.vocabs = null;
	},
	/**
	 * @property events
	 * @type {Object}
	 */
	events: {},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {VocabViewerContent}
	 */
	render: function() {
		this.renderTemplate();
		this.lookup.setElement('#lookup-container').render();
		return this;
	},
	/**
	 * @method set
	 * @param {Vocabs} vocabs
	 * @returns {VocabViewerContent}
	 */
	set: function(vocabs) {
		this.vocabs = vocabs;
		this.lookup.set(vocabs);
		return this.render();
	}
});
