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
    'views/prompts/Rune'
], function(templateStudy, Defn, Rune) {
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
            skritter.timer.setElement(this.$('#timer')).render();
            this.nextPrompt();
            return this;
        },
        loadPrompt: function(item) {
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
            this.prompt.setElement(this.$('#content-container'));
            this.prompt.render();
        },
        nextPrompt: function() {
            skritter.user.data.items.next(_.bind(this.loadPrompt, this));
            //TODO: check to see if this is the most recent prompt
        },
        previousPrompt: function() {
            //TODO: better handle moved backwards through prompts
        }
    });

    return Study;
});