/**
 * @module Skritter
 * @submodule View
 * @param templateVocabList
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-list.html'
], function(templateVocabList) {
    /**
     * @class List
     */
    var List = Backbone.View.extend({
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
            this.$el.html(templateVocabList);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        }
    });
    
    return List;
});