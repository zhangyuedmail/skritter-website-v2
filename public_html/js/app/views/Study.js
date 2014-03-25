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
            skritter.timer.setElement(this.$('#timer')).render();
            if (this.prompt) {
                this.loadPrompt();
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
         * @param {Backbone.Model} item
         */
        loadPrompt: function(item) {
            if (this.prompt) {
                this.prompt.remove();
            } else {
                switch (item.get('part')) {
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
                this.prompt.set(item.createReview());
                
            }
            this.prompt.setElement(this.$('#content-container')).render();
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.nextPrompt, this));
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            this.prompt = null;
            skritter.timer.reset();
            skritter.user.data.items.next(_.bind(this.loadPrompt, this), null, null);
            this.$('#items-due').html(skritter.user.data.items.dueCount(true));
            //TODO: check to see if this is the most recent prompt
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            //TODO: better handle moved backwards through prompts
        }
    });

    return Study;
});