/**
 * @module Skritter
 * @submodule Views
 * @param templateTutorial
 * @param Defn
 * @param Rdng
 * @param Rune
 * @param Tone
 * @author Joshua McFarland
 */

define([
    'require.text!templates/tutorial.html',
    'views/prompts/Defn',
    'views/prompts/Rdng',
    'views/prompts/Rune',
    'views/prompts/Tone'
], function(templateTutorial, Defn, Rdng, Rune, Tone) {
    /**
     * @class Tutorial
     */
    var Tutorial = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.prompt = null;
            Tutorial.vocab = null;
            Tutorial.vocabIds = {
                'ja': ['ja-魚-0'],
                'simp': ['zh-鱼-0'],
                'trad': ['zh-鱼-1']
            };
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.load();
            this.$el.html(templateTutorial);
            return this;
        },
        /**
         * @method load
         */
        load: function() {
            skritter.api.getVocab(Tutorial.vocabIds.simp, _.bind(function(data) {
                skritter.user.settings.set('targetLang', 'zh');
                skritter.user.data.add(data, {silent: true});
                Tutorial.vocab = skritter.user.data.vocabs.at(0);
                this.showTone();
            }, this));
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
            this.prompt.set(review, true);
            this.prompt.setElement(this.$('#content-container')).render();
        },
        /**
         * @method showDefinition
         */
        showDefinition: function() {
            var item = Tutorial.vocab.spawnItem('defn');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.showReading, this));
        },
        /**
         * @method showReading
         */
        showReading: function() {
            var item = Tutorial.vocab.spawnItem('rdng');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
        },
        /**
         * @method showTone
         */
        showTone: function() {
            var item = Tutorial.vocab.spawnItem('tone');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.showDefinition, this));
        },
        /**
         * @method showWriting
         */
        showWriting: function() {
            var item = Tutorial.vocab.spawnItem('rune');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.showTone, this));
        }
    });
    
    return Tutorial;
});