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
    'require.text!templates/tutorial.html'
], function(templateTutorial, Defn, Rdng, Rune, Tone) {
    /**
     * @class Tutorial
     */
    var Tutorial = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
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
            }, this));
        }
    });
    
    return Tutorial;
});