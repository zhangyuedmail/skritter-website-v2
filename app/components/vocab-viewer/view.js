var GelatoComponent = require('gelato/component');
var Vocabs = require('collections/vocabs');
var DictionaryLookup = require('components/dictionary-lookup/view');

/**
 * @class VocabViewer
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.lookup = new DictionaryLookup();
        this.vocab = null;
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
        this.renderTemplate().hide();
        this.lookup.setElement('#vocab-lookup').render();
        return this;
    },
    /**
     * @method renderFields
     * @returns {VocabViewer}
     */
    renderFields: function() {
        this.$('#vocab-difficulty').text(this.vocab.get('toughnessString'));
        this.$('#vocab-definition').html(this.vocab.getDefinition());
        this.$('#vocab-mnemonic').html(this.vocab.getMnemonic().text);
        this.$('#vocab-reading').text(this.vocab.get('reading'));
        this.$('#vocab-sentence').text(this.vocab.getSentence().getWriting());
        this.$('#vocab-writing').text(this.vocab.get('writing'));
        this.lookup.set(this.vocab.get('dictionaryLinks'));
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
            success: function(vocabs) {
                self.vocab = vocabs.at(0);
                self.trigger('load', self.vocab);
                self.renderFields();
                self.show();
            }
        });
        return this;
    },
    /**
     * @method remove
     * @returns {VocabViewer}
     */
    remove: function() {
        this.lookup.remove();
        return GelatoComponent.prototype.remove.call(this);
    }
});
