/**
 * @module Skritter
 * @submodule View
 * @param templateVocabLists
 * @param ListTable
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-lists.html',
    'view/component/ListTable'
], function(templateVocabLists, ListTable) {
    /**
     * @class Lists
     */
    var Lists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.table = new ListTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            this.table.setElement(this.$('#lists')).render();
            this.table.set(skritter.user.data.vocablists.toJSON(), {
                name: 'List Name'
            });
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
    
    return Lists;
});