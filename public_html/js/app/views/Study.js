/**
 * @module Skritter
 * @submodule Views
 * @param templateStudy
 * @param Defn
 * @param Rdng
 * @param Rune
 * @param Tone
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study.html',
    'views/prompts/Defn',
    'views/prompts/Rdng',
    'views/prompts/Rune',
    'views/prompts/Tone'
], function(templateStudy, Defn, Rdng, Rune, Tone) {
    /**
     * @class Study
     */
    var Study = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.prompt = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudy);
            this.stopListening();
            if (window.cordova || skritter.settings.appWidth() <= skritter.settings.get('maxCanvasSize'))
                this.$('#content-container').addClass('full-width');
            skritter.timer.setElement(this.$('#timer')).render();
            if (skritter.user.settings.get('hideDueCount'))
                this.$('#items-due').parent().hide();
            if (skritter.user.settings.get('hideTimer'))
                this.$('#timer').parent().hide();
            if (this.prompt) {
                this.loadPrompt(this.prompt.review);
            } else {
                this.nextPrompt();
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Study #study-view #add-button': 'handleAddItemsButtonClicked',
            'click.Study #study-view #audio-button': 'handleAudioButtonClicked',
            'click.Study #study-view #info-button': 'handleInfoButtonClicked',
            'click.Study #study-view #study-settings-button': 'handleStudySettingsButtonClicked'
        },
        /**
         * @method autoSync
         */
        autoSync: function() {
            if (skritter.user.settings.get('autoSync') &&
                    !skritter.user.data.syncing() &&
                    skritter.user.data.reviews.length > skritter.user.settings.get('autoSyncThreshold'))
                skritter.user.data.sync();
        },
         /**
         * @method handleAddItemsButtonClicked
         * @param {Object} event
         */
        handleAddItemsButtonClicked: function(event) {
            skritter.modals.show('add-items');
            event.preventDefault();
        },
        /**
         * @method handleAudioButtonClicked
         * @param {Object} event
         */
        handleAudioButtonClicked: function(event) {
            if (this.prompt && this.prompt.review.baseVocab().audio())
                skritter.assets.playAudio(this.prompt.review.baseVocab().audio());
            event.preventDefault();
        },
        /**
         * @method handleInfoButtonClicked
         * @param {Object} event
         */
        handleInfoButtonClicked: function(event) {
            skritter.router.navigate('info/' + this.prompt.review.baseVocab().id, {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleStudySettingsButtonClicked
         * @param {Object} event
         */
        handleStudySettingsButtonClicked: function(event) {
            skritter.router.navigate('study/settings', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method loadPrompt
         * @param {Backbone.Model} review
         */
        loadPrompt: function(review) {
            if (this.prompt)
                this.prompt.remove();
            switch (review.get('part')) {
                case 'defn':
                    this.prompt = new Defn();
                    break;
                case 'rdng':
                    this.prompt = new Rdng();
                    break;
                case 'rune':
                    this.prompt = new Rune();
                    break;
                case 'tone':
                    this.prompt = new Tone();
                    break;
            }
            this.prompt.set(review);
            this.prompt.setElement(this.$('#content-container')).render();
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.nextPrompt, this));
            this.updateAudioButtonState();
            this.updateDueCount();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            skritter.timer.reset();
            skritter.user.data.items.sort();
            skritter.user.data.items.next(_.bind(function(item) {
                if (item) {
                    this.autoSync();
                    this.loadPrompt(item.createReview());
                } else {
                    //TODO: handle when a prompt can't be loaded
                }
            }, this), skritter.user.settings.activeParts(), null, skritter.user.settings.style());
        },
        /**
         * @method updateAudioButtonState
         */
        updateAudioButtonState: function() {
            if (this.prompt && this.prompt.review.baseVocab().has('audio')) {
                this.$('#audio-button span').removeClass('fa fa-volume-off');
                this.$('#audio-button span').addClass('fa fa-volume-up');
            } else {
                this.$('#audio-button span').removeClass('fa fa-volume-up');
                this.$('#audio-button span').addClass('fa fa-volume-off');
            }
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.$('#items-due').html(skritter.user.data.items.dueCount());
        }
    });

    return Study;
});