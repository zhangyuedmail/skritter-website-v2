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
            Info.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateInfo);
            if (Info.vocab) {
                this.$('.character-font').addClass(Info.vocab.fontClass());
                this.$('#writing-primary').html(Info.vocab.get('writing'));
                this.$('#writing-secondary').html('');
                this.$('#reading').html(Info.vocab.reading());
                this.$('#definition').html(Info.vocab.definition());
                if (Info.vocab.has('sentenceId')) {
                    this.$('#sentence .writing').html(Info.vocab.sentence().get('writing'));
                    this.$('#sentence .reading').html(Info.vocab.sentence().reading());
                    this.$('#sentence .definition').html(Info.vocab.sentence().definition());
                } else {
                    this.$('#sentence').hide();
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
            'click.Info #info-view .back-button': 'handleBackButtonClicked'
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


