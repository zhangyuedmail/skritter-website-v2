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
                skritter.user.data.setData(data, {silent: true});
                var item = skritter.user.data.items.set(skritter.user.data.vocabs.at(0).spawnItem('rune'), {silent: true});
                this.showRune(item.createReview());
            }, this));
        },
        /**
         * @method showRune
         */
        showRune: function(review) {
            if (this.prompt)
                this.prompt.remove();
            this.prompt = new Rune();
            this.prompt.set(review);
            this.prompt.setElement(this.$('#content-container')).render();
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.nextPrompt, this));
        }
    });
    
    return Tutorial;
});