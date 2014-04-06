/**
 * @module Skritter
 * @submodule Views
 * @param templateTutorial
 * @param TutorialData
 * @param Defn
 * @param Rdng
 * @param Rune
 * @param Tone
 * @author Joshua McFarland
 */

define([
    'require.text!templates/tutorial.html',
    'tutorials/Data',
    'views/prompts/Defn',
    'views/prompts/Rdng',
    'views/prompts/Rune',
    'views/prompts/Tone'
], function(templateTutorial, TutorialData, Defn, Rdng, Rune, Tone) {
    /**
     * @class Tutorial
     */
    var Tutorial = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.position = 0;
            this.prompt = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTutorial);
            this.load();
            this.showWriting();
            return this;
        },
        /**
         * @method load
         * @param {String} language
         */
        load: function(language) {
            language = language ? language : 'zh-trad';
            skritter.user.data.add(TutorialData[language], {silent: true});
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
            var item = skritter.user.data.vocabs.at(this.position).spawnItem('defn');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.showReading, this));
        },
        /**
         * @method showReading
         */
        showReading: function() {
            var item = skritter.user.data.vocabs.at(this.position).spawnItem('rdng');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
        },
        /**
         * @method showTone
         */
        showTone: function() {
            var item = skritter.user.data.vocabs.at(this.position).spawnItem('tone');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.showDefinition, this));
        },
        /**
         * @method showWriting
         */
        showWriting: function() {
            var item = skritter.user.data.vocabs.at(this.position).spawnItem('rune');
            this.loadPrompt(skritter.user.data.items.set(item, {silent: true}).createReview());
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.showTone, this));
        }
    });
    
    return Tutorial;
});