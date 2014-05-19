/**
 * @module Skritter
 * @submodule View
 * @param templateVocabInfo
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-info.html'
], function(templateVocabInfo) {
    /**
     * @class VocabInfo
     */
    var Info = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.vocab = null;
            this.sentence = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            document.title = "Skritter - Info";
            this.$el.html(templateVocabInfo);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-back': 'navigateBack'
        },
        /**
         * @method loadVocab
         */
        loadVocab: function() {
            var vocab = this.vocab;
            var sentence = this.sentence;
            this.$('#info-writing').text(vocab.get('writing'));
            this.$('#info-reading').text(vocab.getReading());
            this.$('#info-definition').text(vocab.getDefinition());
            if (sentence) {
                this.$('#info-sentence .writing').text(sentence.getWriting());
                this.$('#info-sentence .reading').text(sentence.getReading());
                this.$('#info-sentence .definition').text(sentence.getDefinition());
            } else {
                this.$('#info-sentence').parent().hide();
            }
            var mnemonic = vocab.getMnemonic();
            if (mnemonic) {
                this.$('#info-mnemonic').text(mnemonic);
            } else {
                this.$('#info-mnemonic').parent().hide();
            }
        },
        /**
         * @method navigateBack
         * @param {Object} event
         */
        navigateBack: function(event) {
            window.history.back();
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method set
         * @param {String} languageCode
         * @param {String} writing
         */
        set: function(languageCode, writing) {
            var vocabId;
            document.title = "Skritter - Info - " + writing;
            if (languageCode === 'zh') {
                vocabId = skritter.fn.simptrad.toBase(writing);
                skritter.user.data.vocabs.loadVocab(vocabId, _.bind(function(vocab, sentence) {
                    this.sentence = sentence;
                    this.vocab = vocab;
                    this.loadVocab();
                }, this));
            } else if (languageCode === 'ja') {
                vocabId = 'ja-' + writing + '-0';
                skritter.user.data.vocabs.loadVocab(vocabId, _.bind(function(vocab, sentence) {
                    this.sentence = sentence;
                    this.vocab = vocab;
                    this.loadVocab();
                }, this));
            }
        }
    });
    
    return Info;
});