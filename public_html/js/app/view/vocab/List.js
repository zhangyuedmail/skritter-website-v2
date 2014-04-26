/**
 * @module Skritter
 * @submodule View
 * @param templateVocabList
 * @param ListSectionTable
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-list.html',
    'view/component/ListSectionTable'
], function(templateVocabList, ListSectionTable) {
    /**
     * @class List
     */
    var List = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            List.table = new ListSectionTable();
            List.id = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            List.table.setElement(this.$('#sections')).render();
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
        },
        /**
         * @method set
         * @param {String} listId
         * @returns {Backbone.View}
         */
        set: function(listId) {
            List.id = listId;
            List.table.showLoading();
            skritter.api.getVocabList(listId, null, _.bind(function(list) {
                List.model = list;
                List.table.set(listId, list.sections, {
                    name: 'Name',
                    rows: 'Count'
                });
                List.table.hideLoading();
            }, this));
            return this;
        }
    });
    
    return List;
});