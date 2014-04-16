/**
 * @module Skritter
 * @submodule Views
 * @param templateInfo
 * @author Joshua McFarland
 */
define([
    'require.text!templates/info.html'
], function(templateInfo) {
    /**
     * @class Info
     */
    var Info = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Info.buttonBan = null;
            Info.buttonStar = null;
            Info.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateInfo);
            Info.buttonBan = this.$('#ban-button span');
            Info.buttonStar = this.$('#star-button span');
            if (Info.vocab) {
                if (Info.vocab.has('bannedParts') && Info.vocab.get('bannedParts').length > 0) {
                    Info.buttonBan.addClass('text-danger');
                } else {
                    Info.buttonBan.removeClass('text-danger');
                }
                if (Info.vocab.get('starred')) {
                    Info.buttonStar.addClass('text-warning');
                } else {
                    Info.buttonStar.removeClass('text-warning');
                }
                this.$('.character-font').addClass(Info.vocab.fontClass());
                this.$('#writing-primary').html(Info.vocab.get('writing'));
                this.$('#writing-secondary').html('');
                this.$('#reading').html(Info.vocab.reading());
                this.$('#definition').html(Info.vocab.definition());
                this.$('#mnemonic').html(Info.vocab.mnemonic());
                if (Info.vocab.has('sentenceId')) {
                    this.$('#sentence .writing').html(Info.vocab.sentence().get('writing'));
                    this.$('#sentence .reading').html(Info.vocab.sentence().reading());
                    this.$('#sentence .definition').html(Info.vocab.sentence().definition());
                } else {
                    this.$('#sentence').closest('.content-block').hide();
                }
                this.updateAudioButtonState();
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Info #info-view #audio-button': 'handleAudioButtonClicked',
            'click.Info #info-view .back-button': 'handleBackButtonClicked',
            'click.Info #info-view #ban-button': 'toggleBan',
            'click.Info #info-view #edit-definition-button': 'handleEditDefinitionButtonClicked',
            'click.Info #info-view #edit-mnemonic-button': 'handleEditMnemonicButtonClicked',
            'click.Info #info-view #star-button': 'toggleStar'
        },
        /**
         * @method handleAudioButtonClicked
         * @param {Object} event
         */
        handleAudioButtonClicked: function(event) {
            if (Info.vocab && Info.vocab.audio())
                skritter.assets.playAudio(Info.vocab.audio());
            event.preventDefault();
        },
        /**
         * @method handleBackButtonClicked
         * @param {Object} event
         */
        handleBackButtonClicked: function(event) {
            skritter.router.back();
            event.preventDefault();
        },
        /**
         * @method handleEditDefinitionButtonClicked
         * @param {Object} event
         */
        handleEditDefinitionButtonClicked: function(event) {
            if (this.$('#edit-definition-button').html() === 'Edit') {
                var html = this.$('#definition').html();
                this.$('#definition').html("<textarea class='info-edit-text'></textarea>");
                this.$('#definition .info-edit-text').html(html);
                this.$('#definition .info-edit-text').focus();
                this.$('#edit-definition-button').html('Save');
            } else {
                var text = this.$('#definition .info-edit-text').val();
                if (text === '') {
                    Info.vocab.unset('customDefinition');
                    this.$('#definition').html(Info.vocab.definition());
                } else {
                    this.$('#definition').html(text);
                }
                this.$('#edit-definition-button').html('Edit');
                Info.vocab.set('customDefinition', text);
                skritter.user.data.addChangedVocabId(Info.vocab.id);
                Info.vocab.cache();
            }
            event.preventDefault();
        },
        /**
         * @method handleEditMnemonicButtonClicked
         * @param {Object} event
         */
        handleEditMnemonicButtonClicked: function(event) {
            if (this.$('#edit-mnemonic-button').html() === 'Edit') {
                var html = this.$('#mnemonic').html();
                this.$('#mnemonic').html("<textarea class='info-edit-text'></textarea>");
                this.$('#mnemonic .info-edit-text').html(html);
                this.$('#mnemonic .info-edit-text').focus();
                this.$('#edit-mnemonic-button').html('Save');
            } else {
                var text = this.$('#mnemonic .info-edit-text').val();
                if (text === '') {
                    Info.vocab.unset('mnemonic');
                    this.$('#mnemonic').html(Info.vocab.mnemonic());
                } else {
                    this.$('#mnemonic').html(text);
                }
                this.$('#edit-mnemonic-button').html('Edit');
                Info.vocab.set('mnemonic', text === '' ? {text: text, public: false} : {text: text, public: true});
                skritter.user.data.addChangedVocabId(Info.vocab.id);
                Info.vocab.cache();
            }
            event.preventDefault();
        },
        /**
         * @method load
         * @param {String} language
         * @param {String} writing
         */
        load: function(language, writing) {
            if (writing) {
                writing = skritter.fn.simptrad.toBase(writing);
            } else {
                writing = language;
            }
            skritter.user.data.loadVocab(writing, _.bind(function(vocab) {
                Info.vocab = vocab;
                this.render();
            }, this));
        },
        /**
         * @method toggleBan
         * @param {Object} event
         */
        toggleBan: function(event) {
            if (Info.buttonBan.hasClass('text-danger')) {
                Info.buttonBan.removeClass('text-danger');
                Info.vocab.set('bannedParts', []);
            } else {
                Info.buttonBan.addClass('text-danger');
                if (Info.vocab.isChinese()) {
                    Info.vocab.set('bannedParts', ['defn', 'rdng', 'rune', 'tone']);
                } else {
                    Info.vocab.set('bannedParts', ['defn', 'rdng', 'rune']);
                }
            }
            skritter.user.data.addChangedVocabId(Info.vocab.id);
            Info.vocab.cache();
            event.preventDefault();
        },
        /**
         * @method toggleStar
         * @param {Object} event
         */
        toggleStar: function(event) {
            if (Info.buttonStar.hasClass('text-warning')) {
                Info.buttonStar.removeClass('text-warning');
                Info.vocab.set('starred', false);
                
            } else {
                Info.buttonStar.addClass('text-warning');
                Info.vocab.set('starred', true);
            }
            skritter.user.data.addChangedVocabId(Info.vocab.id);
            Info.vocab.cache();
            event.preventDefault();
        },
        /**
         * @method updateAudioButtonState
         */
        updateAudioButtonState: function() {
            if (Info.vocab && Info.vocab.has('audio')) {
                this.$('#audio-button span').removeClass('fa fa-volume-off');
                this.$('#audio-button span').addClass('fa fa-volume-up');
            } else {
                this.$('#audio-button span').removeClass('fa fa-volume-up');
                this.$('#audio-button span').addClass('fa fa-volume-off');
            }
        }
    });

    return Info;
});


