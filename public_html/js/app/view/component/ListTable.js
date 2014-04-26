/**
 * @module Skritter
 * @submodule View
 * @param templateVocabListTable
 * @param VocabLists
 * @author Joshua McFarland
 */
define([
    'require.text!template/component-list-table.html',
    'collection/data/VocabLists'
], function(templateVocabListTable, VocabLists) {
    /**
     * @class VocabListsTable
     */
    var Table = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Table.fieldMap = {};
            Table.message = null;
            Table.lists = new VocabLists();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListTable);
            Table.message = this.$('#message');
            Table.tableHead = this.$('table thead');
            Table.tableBody = this.$('table tbody');
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
            'vclick #vocab-lists-table-container table tr': 'navigateList'
        },
        /**
         * @method hide
         * @returns {Backbone.View}
         */
        hide: function() {
            this.$el.hide();
            return this;
        },
        /**
         * @method hideLoading
         * @returns {Backbone.View}
         */
        hideLoading: function() {
            Table.message.hide();
            return this;
        },
        /**
         * @method navigateList
         * @param {Object} event
         */
        navigateList: function(event) {
            var listId = event.currentTarget.id.replace('list-', '');
            skritter.router.navigate('vocab/list/' + listId, {trigger: true, replace: true});
            event.preventDefault();
        },
        /**
         * @method populate
         * @returns {Backbone.View}
         */
        populate: function() {
            var divHead = '';
            var divBody = '';
            Table.tableHead.html(divHead);
            Table.tableBody.html(divBody);
            //generates the header section of the table
            divHead += "<tr>";
            for (var a in Table.fieldMap)
                divHead += "<th><h4>" + Table.fieldMap[a] + "</h4></th>";
            divHead += "</tr>";
            //checks whether lists were returned and if any of them were active
            if (Table.lists && Table.lists.length > 0) {
                //generates the body section of the table
                for (var b in Table.lists.models) {
                    var list = Table.lists.at(b);
                    divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                    for (var field in Table.fieldMap) {
                        var fieldValue = list.get(field);
                        if (field === 'studyingMode') {
                            if (fieldValue === 'not studying') {
                                divBody += "<td class='list-field-" + field + "'></td>";
                            } else if (fieldValue === 'finished') {
                                divBody += "<td class='list-field-" + field + "'></td>";
                            } else {
                                divBody += "<td class='list-field-" + field + "'></td>";
                            }
                        } else {
                            divBody += "<td class='list-field-" + field + "'><h6>" + fieldValue + "</h6></td>";
                        }
                    }
                    divBody += "</tr>";
                }
            }
            Table.tableHead.html(divHead);
            Table.tableBody.html(divBody);
            return this;
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
         * @param {Array} lists
         * @param {Object} fieldMap
         * @returns {Backbone.View}
         */
        set: function(lists, fieldMap) {
            Table.fieldMap = fieldMap ? fieldMap : Table.fieldMap;
            Table.lists.add(lists, {silent: true, sort: true});
            this.populate();
            return this;
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            this.$el.show();
            return this;
        },
        /**
         * @method showLoading
         * @param {String} text
         * @returns {Backbone.View}
         */
        showLoading: function(text) {
            text = text ? text : 'Loading';
            Table.message.show();
            Table.message.html("<span class='text-info'><i class='fa fa-spinner fa-spin'></i> " + text + "</span>");
            return this;
        }
    });

    return Table;
});