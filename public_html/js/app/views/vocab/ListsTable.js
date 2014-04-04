/**
 * @module Skritter
 * @submodule Views
 * @param templateVocabListsTable
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-lists-table.html'
], function(templateVocabListsTable) {
    /**
     * @class VocabListsTable
     */
    var Table = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Table.fieldNameMap
            Table.lists = [];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListsTable);
            var divHead = '';
            var divBody = '';
            this.$('#message').text('');
            this.$('table thead').html(divHead);
            this.$('table tbody').html(divBody);
            //generates the header section of the table
            divHead += "<tr>";
            for (var a in Table.fieldNameMap)
                divHead += "<th>" + Table.fieldNameMap[a] + "</th>";
            divHead += "</tr>";
            //checks whether lists were returned and if any of them were active
            if (!Table.lists && !Table.loading) {
                this.$('#message').show().text("Unable to load lists due to being offline.");
            } else if (Table.lists && Table.lists.length === 0 && !Table.loading) {
                this.$('#message').show().text("You haven't added any lists yet!");
            } else {
                //generates the body section of the table
                for (var b in Table.lists) {
                    var list = Table.lists[b];
                    divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                    for (var field in Table.fieldNameMap)
                        divBody += "<td class='list-field-" + field + "'>" + list[field] + "</td>";
                    divBody += "</tr>";
                }
            }
            this.$('table thead').html(divHead);
            this.$('table tbody').html(divBody);
            return this;
        },
        /**
         * @method set
         * @param {Array} lists
         * @param {Object} fieldNameMap
         * @returns {Backbone.View}
         */
        set: function(lists, fieldNameMap) {
            Table.fieldNameMap = fieldNameMap;
            Table.lists = lists;
            return this;
        }
    });

    return Table;
});

