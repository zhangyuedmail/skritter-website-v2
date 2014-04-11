/**
 * @module Skritter
 * @submodule Views
 * @param templateVocabListsTable
 * @param VocabLists
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-lists-table.html',
    'collections/data/vocablists'
], function(templateVocabListsTable, VocabLists) {
    /**
     * @class VocabListsTable
     */
    var Table = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Table.fieldNameMap = [];
            Table.lists = new VocabLists();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListsTable);
            var divHead = '';
            var divBody = '';
            this.$('table thead').html(divHead);
            this.$('table tbody').html(divBody);
            //generates the header section of the table
            divHead += "<tr>";
            for (var a in Table.fieldNameMap)
                divHead += "<th>" + Table.fieldNameMap[a] + "</th>";
            divHead += "</tr>";
            //checks whether lists were returned and if any of them were active
            if (Table.lists && Table.lists.length > 0) {
                //generates the body section of the table
                for (var b in Table.lists.models) {
                    var list = Table.lists.at(b);
                    divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                    for (var field in Table.fieldNameMap) {
                        var fieldValue = list.get(field);
                        if (field === 'studyingMode') {
                            if (fieldValue === 'not studying') {
                                divBody += "<td class='list-field-" + field + "'><span class='fa fa-circle-o'></span></td>";
                            } else if (fieldValue === 'finished') {
                                divBody += "<td class='list-field-" + field + "'><span class='fa fa-circle'></span></td>";
                            } else {
                                divBody += "<td class='list-field-" + field + "'><span class='fa fa-dot-circle-o'></span></td>";
                            }
                        } else {
                            divBody += "<td class='list-field-" + field + "'>" + fieldValue + "</td>";
                        }
                    }
                    divBody += "</tr>";
                }
            }
            this.$('table thead').html(divHead);
            this.$('table tbody').html(divBody);
            return this;
        },
        /**
         * @method hideLoading
         */
        hideLoading: function() {
            this.$('#loader').hide();
        },
        /**
         * @method set
         * @param {Array} lists
         * @param {Object} fieldNameMap
         * @returns {Backbone.View}
         */
        set: function(lists, fieldNameMap) {
            Table.fieldNameMap = fieldNameMap;
            Table.lists.add(lists, {silent: true});
            return this;
        },
        /**
         * @method showLoading
         */
        showLoading: function() {
            this.$('#loader').show();
        }
    });

    return Table;
});

