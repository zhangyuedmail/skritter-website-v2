/**
 * @module Skritter
 * @submodule Views
 * @param templateVocabLists
 * @param ListsTable
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-lists.html',
    'views/vocab/ListsTable'
], function(templateVocabLists, ListsTable) {
    /**
     * @class VocabLists
     */
    var VocabLists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabLists.lists = new ListsTable();
            VocabLists.sort = 'studying';
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            VocabLists.lists.setElement(this.$('#lists-table')).render();
            this.load();
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
            'click.VocabLists #vocab-lists-view #sort button': 'handleSortButtonClicked'
        },
        /**
         * @method handleSortButtonClicked
         * @param {Object} event
         */
        handleSortButtonClicked: function(event) {
            this.load(event.currentTarget.id.replace('sort-', ''));
            event.preventDefault();
        },
        /**
         * @method load
         * @param {String} sort
         */
        load: function(sort) {
            sort = sort ? sort : VocabLists.sort;
            skritter.api.getVocabLists(skritter.settings.language(), sort, null, function(lists) {
                VocabLists.sort = sort;
                VocabLists.lists.set(lists, {
                    name: 'Name',
                    studyingMode: 'Status'
                }).render();
            });
        }
    });
    
    return VocabLists;
});