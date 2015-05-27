/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/row-table.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class RowTable
     * @extends GelatoComponent
     */
    var RowTable = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.fields = {};
            this.filtered = [];
            this.list = null;
            this.sections = [];
        },
        /**
         * @method render
         * @returns {RowTable}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderTable
         * @returns {RowTable}
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
                var row = this.filtered[i];
                var vocab = app.user.data.vocabs.get(row.vocabId);
                tableBody += "<tr id='row-" + row.vocabId + "' class='cursor'>";
                for (var field2 in this.fields) {
                    tableBody += "<td class='field-" + field2.toLowerCase() + "'>";
                    switch (field2) {
                        case 'definition':
                            tableBody += vocab.getDefinition(true);
                            break;
                        case 'reading':
                            tableBody += vocab.getReading();
                            break;
                        case 'select':
                            tableBody += '<input type="checkbox" name="selected" value="" />';
                            break;
                        case 'tradVocabId':
                            tableBody += row[field2] === row.vocabId ? '- -' : app.fn.mapper.fromBase(row[field2]);
                            break;
                        case 'vocabId':
                            tableBody += app.fn.mapper.fromBase(row[field2]);
                            break;
                        default:
                            tableBody += row[field2];
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
            'vclick .field-tradvocabid': 'handleClickRow',
            'vclick .field-vocabid': 'handleClickRow'
        },
        /**
         * @method filterBy
         * @param {String} value
         * @returns {RowTable}
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
         * @method handleClickFieldName
         * @param {Event} event
         */
        handleClickRow: function(event) {
            event.preventDefault();
            var $row = $(event.currentTarget).parent('tr');
            var rowId = $row.get(0).id.replace('row-', '');
            //TODO: open the vocab word modal
        },
        /**
         * @method set
         * @param {Object} section
         * @param {Object} fields
         * @returns {RowTable}
         */
        set: function(section, fields) {
            this.fields = fields || {};
            this.filtered = section.rows || [];
            this.sections = section.rows || [];
            this.renderTable();
            return this;
        },
        /**
         * @method sortBy
         * @param {String} field
         * @returns {RowTable}
         */
        sortBy: function(field) {
            this.filtered = _.sortBy(this.filtered, function(list) {
                return list.get(field);
            });
            this.renderTable();
            return this;
        }
    });

    return RowTable;

});