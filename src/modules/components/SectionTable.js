/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/section-table.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class SectionTable
     * @extends GelatoComponent
     */
    var SectionTable = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
            this.fields = {};
            this.filtered = [];
            this.list = null;
            this.sections = [];
        },
        /**
         * @method render
         * @returns {SectionTable}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderTable
         * @returns {SectionTable}
         */
        renderTable: function() {
            var tableBody = '';
            var tableHead = '';
            //table head
            tableHead += "<tr>";
            for (var field1 in this.fields) {
                tableHead += "<th>";
                tableHead += this.fields[field1];
                tableHead += "</th>";
            }
            tableHead += "</tr>";
            //table body
            for (var i = 0, length = this.filtered.length; i < length; i++) {
                var section = this.filtered[i];
                tableBody += "<tr id='row-" + section.id + "' class='cursor'>";
                for (var field2 in this.fields) {
                    tableBody += "<td class='field-" + field2.toLowerCase() + "'>";
                    switch (field2) {
                        case 'wordCount':
                            tableBody += this.getWordCount({section: section});
                            break;
                        default:
                            tableBody += section[field2];
                    }
                    tableBody += "</td>";
                }
                tableBody += "</tr>";
            }
            this.$('table tbody').html(tableBody);
            this.$('table thead').html(tableHead);
            this.renderEvents();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .field-name': 'handleClickFieldName'
        },
        /**
         * @method filterBy
         * @param {String} value
         * @returns {SectionTable}
         */
        filterBy: function(value) {
            this.filtered = _.filter(this.sections, function(list) {
                if (list.get('name').indexOf(value) > -1) {
                    return true;
                }
                return false;
            });
            this.renderTable();
            return this;
        },
        /**
         * @method getWordCount
         * @param {Object} [options]
         * @returns {Number}
         */
        getWordCount: function(options) {
            options = options || {};
            var section = options.section || {rows: []};
            return section.rows.length;
        },
        /**
         * @method handleClickFieldName
         * @param {Event} event
         */
        handleClickFieldName: function(event) {
            event.preventDefault();
            var $row = $(event.currentTarget).parent('tr');
            var listId = this.list.id;
            var sectionId = $row.get(0).id.replace('row-', '');
            this.app.router.navigate('lists/browse/' + listId + '/' + sectionId);
        },
        /**
         * @method set
         * @param {DataVocabList} list
         * @param {Object} fields
         * @returns {SectionTable}
         */
        set: function(list, fields) {
            this.fields = fields || {};
            this.filtered = list.get('sections') || [];
            this.list = list;
            this.sections = list.get('sections') || [];
            this.renderTable();
            return this;
        },
        /**
         * @method sortBy
         * @param {String} field
         * @returns {SectionTable}
         */
        sortBy: function(field) {
            this.filtered = _.sortBy(this.filtered, function(list) {
                return list.get(field);
            });
            this.renderTable();
            return this;
        }
    });

    return SectionTable;

});