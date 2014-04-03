/**
 * @module Skritter
 * @submodule Views
 * @param templateVocabLists
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-lists.html'
], function(templateVocabLists) {
    /**
     * @class VocabLists
     */
    var VocabLists = Backbone.View.extend({
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
            this.$el.html(templateVocabLists);
            return this;
        }
    });
    
    return VocabLists;
});