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
            this.index = -1;
            this.prompt = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudy);
            this.stopListening();
            this.$('#items-due').html(skritter.user.data.items.dueCount(true));
            skritter.timer.setElement(this.$('#timer')).render();
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
            'click.Study #study-view #info-button': 'handleInfoButtonClicked',
            'click.Study #study-view #study-settings-button': 'handleStudySettingsButtonClicked'
        },
        /**
         * @method autoSync
         */
        autoSync: function() {
            if (skritter.user.settings.get('autoSync') &&
                    skritter.user.data.reviews.length > skritter.user.settings.get('autoSyncThreshold'))
                skritter.user.data.sync();
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
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            skritter.timer.reset();
            skritter.user.data.items.next(_.bind(function(item) {
                this.autoSync();
                this.loadPrompt(item.createReview());
                this.$('#items-due').html(skritter.user.data.items.dueCount(true));
            }, this), skritter.user.settings.activeParts(), null, skritter.user.settings.style());
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            var review = skritter.user.data.reviews.at(this.index + 1);
            if (review) {
                review.load(_.bind(function(item) {
                    if (item) {
                        this.loadPrompt(review);
                        this.index++;
                    }
                }, this));
            }
        }
    });

    return Study;
});