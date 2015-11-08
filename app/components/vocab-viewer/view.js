var Component = require('base/component');
var Vocabs = require('collections/vocabs');
var DictionaryLookup = require('components/dictionary-lookup/view');

/**
 * @class VocabViewer
 * @extends {Component}
 */
module.exports = Component.extend({
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
        this.renderTemplate();
        this.lookup.setElement('#vocab-lookup-container').render();
        if (this.vocab) {
            this.lookup.set(this.vocab.get('dictionaryLinks'));
        }
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
                self.render();
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
        return Component.prototype.remove.call(this);
    }
});
