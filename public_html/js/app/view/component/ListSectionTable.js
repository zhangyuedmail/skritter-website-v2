/**
 * @module Skritter
 * @submodule View
 * @param templateVocabListSectionTable
 * @param VocabLists
 * @author Joshua McFarland
 */
define([
    'require.text!template/component-list-section-table.html',
    'collection/data/VocabLists'
], function(templateVocabListSectionTable, VocabLists) {
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
            this.$el.html(templateVocabListSectionTable);
            Table.listId = null;
            Table.message = this.$('#message');
            Table.tableHead = this.$('table thead');
            Table.tableBody = this.$('table tbody');
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
            'vclick #vocab-list-section-table-container table tr': 'navigateListSection'
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
        navigateListSection: function(event) {
            var sectionId = event.currentTarget.id.replace('section-', '');
            skritter.router.navigate('vocab/list/' + Table.listId + '/' + sectionId, {trigger: true, replace: true});
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
            if (Table.sections && Table.sections.length > 0) {
                //generates the body section of the table
                for (var b in Table.sections) {
                    var section = Table.sections[b];
                    divBody += "<tr id='section-" + section.id + "' class='cursor'>";
                    for (var field in Table.fieldMap) {
                        var fieldValue = section[field];
                        if (field === 'rows') {
                            divBody += "<td class='list-field-" + field + "'><h6>" + fieldValue.length + " Words</h6></td>";
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
         * @param {String} listId
         * @param {Array} sections
         * @param {Object} fieldMap
         * @returns {Backbone.View}
         */
        set: function(listId, sections, fieldMap) {
            Table.listId = listId;
            Table.fieldMap = fieldMap ? fieldMap : Table.fieldMap;
            Table.sections = sections;
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