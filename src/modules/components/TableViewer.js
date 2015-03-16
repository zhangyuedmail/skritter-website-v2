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
                var value = this.fields[head];
                if (typeof value === 'object') {
                    tableHead += "<th>" + value.head + "</th>";
                } else {
                    tableHead += "<th>" + value + "</th>";
                }
            }
            tableHead += "</tr>";
            //body section
            for (var i = 0, length = this.rows.length; i < length; i++) {
                var row = this.rows[i];
                tableBody += "<tr id='row-" + row.id + "' class='cursor'>";
                for (var fieldName in this.fields) {
                    var fieldValue = row.get(fieldName) || this.fields[fieldName];
                    tableBody += "<td class='field-" + fieldName + "'>";
                    if (typeof fieldValue === 'object') {
                        tableBody += fieldValue.body;
                    } else {
                        tableBody += fieldValue;
                    }
                    tableBody += "</td>";
                }
                tableBody += "</tr>";
            }
            if (this.options.hideHead) {
                this.$('table thead').hide();
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
         * @method hideSearchBar
         * @returns {TableViewer}
         */
        hideSearchBar: function() {
            this.$('.search-bar').hide();
            return this;
        },
        /**
         * @method load
         * @param {Array} rows
         * @param {Object} fields
         * @param {Object} [options]
         * @returns {TableViewer}
         */
        load: function(rows, fields, options) {
            this.data = rows;
            this.fields = fields;
            this.options = options || {};
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
        },
        /**
         * @method showSearchBar
         * @returns {TableViewer}
         */
        showSearchBar: function() {
            this.$('.search-bar').show();
            return this;
        },
        /**
         * @method sortBy
         * @param {String} fieldName
         * @param {Boolean} [descending]
         */
        sortBy: function(fieldName, descending) {
            this.rows = _.sortBy(this.rows, function(list) {
                return list.get(fieldName);
            });
            if (descending) {
                this.rows.reverse();
            }
            this.renderTable();
            return this;
        }
    });

    return TableViewer;

});