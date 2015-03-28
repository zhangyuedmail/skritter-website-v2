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
            this.options = {};
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
            for (var fieldName in this.fields) {
                var field = this.fields[fieldName];
                if (typeof field === 'object' && field.title) {
                    tableHead += "<th>" + field.title + "</th>";
                } else {
                    tableHead += "<th>" + field + "</th>";
                }
            }
            tableHead += "</tr>";
            //body section
            for (var i = 0, length = this.rows.length; i < length; i++) {
                var row = this.rows[i];
                tableBody += "<tr id='row-" + row.id + "' class='cursor'>";
                for (var fieldName in this.fields) {
                    var field = this.fields[fieldName];
                    var fieldValue = row instanceof Backbone.Model ? row.get(fieldName) : row[fieldName];
                    tableBody += "<td class='field-" + fieldName + "'>";
                    if (field.type === 'link') {
                        tableBody += "<a href='#'>" + field.linkText + "</a>";
                    } else if (field.type === 'progress') {
                        //TODO: change progress to actual value
                        tableBody += this.getProgressBar({value: Math.floor(Math.random() * 100) + 1});
                    } else if (field.type === 'text') {
                        tableBody += fieldValue;
                    } else {
                        tableBody += fieldValue;
                    }
                    tableBody += "</td>";
                }
                tableBody += "</tr>";
            }
            if (this.options.showHeaders) {
                this.$('table thead').show();
            } else {
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
         * @method getProgressBar
         * @param {Object} [options]
         * @returns {String}
         */
        getProgressBar: function(options) {
            options = options || {};
            options.value = options.value || 0;
            var html = "<div class='progress'>";
            html += "<div class='progress-bar' role='progressbar' aria-valuenow='" + options.value + "' ";
            html += "aria-valuemin='0' aria-valuemax='100' style='width: " + options.value + "%;'>";
            html += "<span class='sr-only'>" + options.value + "% Complete</span>";
            html += "</div></div>";
            return html;
        },
        /**
         * @method resize
         * @returns {TableViewer}
         */
        resize: function() {
            return this;
        },
        /**
         * @method set
         * @param {Array} rows
         * @param {Object} fields
         * @param {Object} [options]
         * @returns {TableViewer}
         */
        set: function(rows, fields, options) {
            this.data = rows;
            this.fields = fields;
            this.options = options || {showHeaders: true};
            this.rows = rows;
            this.renderTable();
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