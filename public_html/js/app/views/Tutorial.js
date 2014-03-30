/**
 * @module Skritter
 * @submodule Views
 * @param templateTutorial
 * @author Joshua McFarland
 */

define([
    'require.text!templates/tutorial.html'
], function(templateTutorial) {
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