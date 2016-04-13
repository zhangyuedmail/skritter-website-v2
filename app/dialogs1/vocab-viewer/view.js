var GelatoDialog = require('base/gelato-dialog');

var Vocabs = require('collections/vocabs');
var Content = require('dialogs1/vocab-viewer/content/view');

/**
 * @class VocabViewer
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
	/**
	 * @method initialize
	 * @constructor
	 */
	initialize: function() {
		this.content = new Content({dialog: this});
		this.vocabs = new Vocabs();
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {VocabViewer}
	 */
	render: function() {
		this.renderTemplate();
		this.content.setElement('#content-container').render();
		return this;
	},
	/**
	 * @method load
	 * @param {String} vocabId
	 * @returns {VocabViewer}
	 */
	load: function(vocabId) {
		var self = this;
		this.vocabs.fetch({
			data: {
				include_containing: true,
				include_decomps: true,
				include_heisigs: true,
				include_sentences: true,
				include_strokes: true,
				include_top_mnemonics: true,
				ids: vocabId
			},
			error: function(error) {
				console.error(error);
			},
			success: function(vocabs) {
				self.content.set(vocabs);
			}
		});
		return this;
	},
	/**
	 * @method remove
	 * @returns {VocabViewer}
	 */
	remove: function() {
		this.content.remove();
		this.vocabs.reset();
		return GelatoDialog.prototype.remove.call(this);
	}
});
