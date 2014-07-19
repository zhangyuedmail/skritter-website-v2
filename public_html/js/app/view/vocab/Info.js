define([
    'require.text!template/vocab-info.html',
    'view/View'
], function(template, View) {
    /**
     * @class VocabInfo
     */
    var VocabInfo = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
            this.vocab = null;
        },
        /**
         * @method render
         * @returns {VocabInfo}
         */
        render: function() {
            this.setTitle('Vocab');
            this.$el.html(_.template(template, skritter.strings));
            this.preloadFonts();
            this.replaceCharacterFont();
            this.loadElements();
            return this;
        },
        /**
         * @method loadElements
         */
        loadElements: function() {
            this.elements.buttonStar = this.$('.button-star i');
            this.elements.contained = this.$('.vocab-contained');
            this.elements.decomps = this.$('.vocab-decomps');
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
            return _.extend({}, View.prototype.events, {
                'vclick .button-edit-definition': 'handleEditDefinitionClicked',
                'vclick .button-star': 'handleStarClicked',
                'vclick .vocab-contained tbody tr': 'handleTableRowClicked',
                'vclick .vocab-reading .reading': 'playAudio'
            });
        },
        /**
         * @method handleEditDefinitionClicked
         * @param {Object} event
         */
        handleEditDefinitionClicked: function(event) {
            skritter.modal.showEditDefinition(this.vocab);
            event.preventDefault();
        },
        /**
         * @method handleStarClicked
         * @param {Object} event
         */
        handleStarClicked: function(event) {
            if (this.vocab.get('starred')) {
                this.vocab.set('starred', false);
            } else {
                this.vocab.set('starred', true);
            }
            this.toggleStar();
            event.preventDefault();
        },
        /**
         * @method handleTableRowClicked
         * @param {Object} event
         */
        handleTableRowClicked: function(event) {
            var writing = event.currentTarget.id.replace('writing-', '');
            skritter.router.navigate('vocab/info/' + skritter.user.getLanguageCode() + '/' + writing, {replace: true, trigger: true});
            event.preventDefault();
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
            if (vocab.has('audio')) {
                this.elements.reading.addClass('has-audio');
            }
            if (vocab.get('starred')) {
                this.toggleStar();
            }
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
            if (vocab.getCharacterCount() > 1) {
                this.elements.decomps.closest('.content-block').hide();
                this.elements.contained.find('tbody').html(this.vocab.getContainedRows());
            } else {
                this.elements.contained.closest('.content-block').hide();
                var decomps = this.vocab.getDecomps();
                if (decomps.length > 0 && !decomps[0].get('atomic')) {
                    this.elements.decomps.find('tbody').html(decomps[0].getChildrenRows());
                } else {
                    this.elements.decomps.closest('.content-block').hide();
                }
            }
            this.replaceCharacterFont();
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            if (this.vocab.has('audio')) {
                if (skritter.user.isChinese()) {
                    var filename = this.$(event.currentTarget).data('reading') + '.mp3';
                    skritter.assets.playAudio(filename.toLowerCase());
                } else {
                    this.vocab.playAudio();
                }
                event.stopPropagation();
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
        },
        /**
         * @method toggleStar
         */
        toggleStar: function() {
            if (this.elements.buttonStar.hasClass('fa-star-o')) {
                this.elements.buttonStar.addClass('fa-star');
                this.elements.buttonStar.removeClass('fa-star-o');
            } else {
                this.elements.buttonStar.addClass('fa-star-o');
                this.elements.buttonStar.removeClass('fa-star');
            }
        }
    });

    return VocabInfo;
});