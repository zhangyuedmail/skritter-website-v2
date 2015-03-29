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
                    tableHead += "<th></th>";
                }
            }
            tableHead += "</tr>";
            //body section
            for (var i = 0, length = this.rows.length; i < length; i++) {
                var row = this.rows[i];
                var rowId = row.id || row.vocabId;
                tableBody += "<tr id='row-" + rowId + "' class='cursor'>";
                for (var fieldName in this.fields) {
                    var row = row instanceof Backbone.Model ? row.toJSON() : row;
                    var fieldObject = this.fields[fieldName];
                    var fieldValue = row[fieldName];
                    tableBody += "<td class='field-" + fieldName.toLowerCase() + "'>";
                    if (fieldObject.type === 'checkbox') {
                        tableBody += "<input type='checkbox' name='row' value='" + rowId + "' />";
                    } else if (fieldObject.type === 'link') {
                        tableBody += "<a href='#'>" + field.linkText + "</a>";
                    } else if (fieldObject.type === 'progress') {
                        //TODO: change progress to actual value
                        tableBody += this.getProgressBar({value: Math.floor(Math.random() * 100) + 1});
                    } else if (fieldObject.type === 'section-status') {
                        //TODO: check status of section
                        tableBody += '';
                    } else if (fieldObject.type === 'section-wordcount') {
                        tableBody += fieldValue.length + (fieldValue.length === 1 ? ' word' : ' words');
                    } else if (fieldObject.type === 'text') {
                        if (fieldName === 'tradVocabId') {
                            tableBody += row.tradVocabId === row.vocabId ? '- - -' : row.tradVocabId;
                        } else {
                            tableBody += fieldValue;
                        }
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
         * @method filterBy
         * @param {String} fieldName
         * @param {String} value
         * @returns {TableViewer}
         */
        filterBy: function(fieldName, value) {
            this.rows = this.data.filter(function(item) {
                var fieldValue = item instanceof Backbone.Model ? item.get(fieldName) : item[fieldName].toLowerCase();
                if (fieldValue.indexOf(value.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            });
            return this.renderTable();
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
            this.rows = _.sortBy(this.rows, function(item) {
                return item instanceof Backbone.Model ? item.get(fieldName) : item[fieldName];
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