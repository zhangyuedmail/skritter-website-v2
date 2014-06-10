define([
    'require.text!template/vocab-info.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class VocabInfo
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Vocab - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
            BaseView.prototype.renderElements.call(this);
            this.elements.definition = this.$('.vocab-definition');
            this.elements.mnemonic = this.$('.vocab-mnemonic');
            this.elements.mnemonicAuthor = this.$('.vocab-mnemonic-author');
            this.elements.reading = this.$('.vocab-reading');
            this.elements.sentence = this.$('.vocab-sentence');
            this.elements.sentenceDefinition = this.$('.vocab-sentence .definition');
            this.elements.sentenceReading = this.$('.vocab-sentence .reading');
            this.elements.sentenceWriting = this.$('.vocab-sentence .writing');
            this.elements.writing = this.$('.vocab-writing');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
            });
        },
        /**
         * @method loadVocab
         */
        loadVocab: function() {
            var vocab = this.vocab;
            var mnemonic = vocab.getMnemonic();
            var sentence = vocab.getSentence();
            this.elements.writing.html(vocab.getWriting());
            this.elements.reading.html(vocab.getReading());
            this.elements.definition.text(vocab.getDefinition());
            if (sentence) {
                this.elements.sentenceWriting.text(sentence.getWriting());
                this.elements.sentenceReading.text(sentence.getReading());
                this.elements.sentenceDefinition.text(sentence.getDefinition());
            } else {
                this.elements.sentence.closest('.content-block').hide();
            }
            if (mnemonic) {
                this.elements.mnemonic.html(skritter.fn.textToHTML(mnemonic.text));
                this.elements.mnemonicAuthor.text('Created by: ' + mnemonic.creator);
            } else {
                this.elements.mnemonic.closest('.content-block').hide();
            }
        },
        /**
         * @method set
         * @param {String} languageCode
         * @param {String} writing
         */
        set: function(languageCode, writing) {
            document.title = writing + ' - Vocab - Skritter';
            var vocabId = languageCode === 'zh' ? skritter.fn.mapper.toBase(writing) : 'ja-' + writing + '-0';
            skritter.user.data.loadVocab(vocabId, _.bind(function(vocab) {
                console.log('loaded vocab', vocab);
                this.vocab = vocab;
                this.loadVocab();
            }, this));
        }
    });
    
    return View;
});