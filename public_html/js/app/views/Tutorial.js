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
            Tutorial.data = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTutorial);
            if (skritter.user.settings.has('style')) {
                switch (skritter.user.settings.get('style')) {
                    case 'simp':
                        Tutorial.data = TutorialData['zh-simp'];
                        break;
                    case 'trad':
                        Tutorial.data = TutorialData['zh-trad'];
                        break;
                    default:
                        Tutorial.data = TutorialData['ja'];
                        break;
                }
                skritter.user.data.clear().add(Tutorial.data, {silent: true});
                this.next();
            } else {
                this.listenToOnce(skritter.modals, 'language-selected', this.render);
                this.openLanguageSelect();
            }
            return this;
        },
        /**
         * @method next
         */
        next: function() {
            this.showWriting();
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
         * @method openLanguageSelect
         */
        openLanguageSelect: function() {
            if (window.cordova) {
                if (skritter.settings.language() === 'zh')
                    skritter.modals.show('language-select').set('.modal-body #japanese-button', null, 'hidden');
            } else {
                skritter.modals.show('language-select');
            }
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