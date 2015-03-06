/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/table-viewer.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class TableViewer
     * @extends GelatoComponent
     */
    var TableViewer = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.data = [];
            this.fields = {};
            this.rows = [];
            this.prompt = options.prompt;
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {TableViewer}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderTable
         * @returns {TableViewer}
         */
        renderTable: function() {
            var tableBody = '';
            var tableHead = '';
            this.clear();
            //head section
            tableHead += "<tr>";
            for (var head in this.fields) {
                tableHead += "<th>" + this.fields[head] + "</th>";
            }
            tableHead += "</tr>";
            //body section
            for (var i = 0, length = this.rows.length; i < length; i++) {
                var row = this.rows[i];
                tableBody += "<tr id='row-" + row.id + "'>";
                for (var fieldName in this.fields) {
                    var fieldValue = row[fieldName];
                    tableBody += "<td class='field-" + fieldName + "'>";
                    tableBody += fieldValue;
                    tableBody += "</td>";
                }
                tableBody += "</tr>";
            }
            this.$('table tbody').html(tableBody);
            this.$('table thead').html(tableHead);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method clear
         * @returns {TableViewer}
         */
        clear: function() {
            this.$('table tbody').empty();
            this.$('table thead').empty();
            return this;
        },
        /**
         * @method load
         * @param {Array} rows
         * @param {Object} fields
         * @returns {TableViewer}
         */
        load: function(rows, fields) {
            this.data = rows;
            this.fields = fields;
            this.rows = rows;
            this.renderTable();
            return this;
        },
        /**
         * @method resize
         * @returns {TableViewer}
         */
        resize: function() {
            return this;
        }
    });

    return TableViewer;

});