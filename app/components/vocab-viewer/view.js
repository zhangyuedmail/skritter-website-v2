var GelatoComponent = require('gelato/modules/component');
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
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/vocab-viewer/template'),
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
        this.$('#vocab-mnemonic').html(this.vocab.getMnemonicText());
        this.$('#vocab-reading').text(this.vocab.getReading());
        this.$('#vocab-sentence').text(this.vocab.getSentenceWriting());
        this.$('#vocab-writing').text(this.vocab.getWriting());
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
        app.api.fetchVocabs({
            ids: vocabId,
            include_decomps: true,
            include_heisigs: true,
            include_sentences: true,
            include_strokes: true,
            include_top_mnemonics: true
        }, function(result) {
            console.log(result);
            app.user.data.add(result);
            self.vocab = app.user.data.vocabs.get(result.Vocabs[0].id);
            self.trigger('load', self.vocab);
            self.renderFields();
            self.show();
        }, function(error) {
            console.error('VOCAB LOAD ERROR:', error);
        });
        return this;
    },
    /**
     * @method remove
     * @returns {Vocabs}
     */
    remove: function() {
        this.lookup.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
