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
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTutorial);
            return this;
        }
    });
    
    return Tutorial;
});