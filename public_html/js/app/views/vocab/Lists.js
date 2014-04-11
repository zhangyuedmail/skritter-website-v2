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
            VocabLists.defaultSort = 'studying';
            VocabLists.table = new ListsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            VocabLists.table.setElement(this.$('#vocab-lists'));
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
            sort = sort ? sort : VocabLists.defaultSort;
            this.$('#search #sort .btn-group button').removeClass('active');
            this.$('#search #sort #sort-' + sort).addClass('active');
            VocabLists.table.render().showLoading();
            skritter.api.getVocabLists(skritter.settings.language(), sort, null, function(lists) {
                if (sort === 'studying')
                    lists = skritter.user.data.vocablists.toJSON();
                VocabLists.table.set(lists, {
                    name: 'Name',
                    studyingMode: 'Status'
                }).render().hideLoading();
            });
        }
    });
    
    return VocabLists;
});