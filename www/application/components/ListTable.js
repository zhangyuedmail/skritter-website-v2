
/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView',
    'require.text!templates/table.html'
], function(BaseView, Template) {
    /**
     * @class ListTable
     * @extend BaseView
     */
    var ListTable = BaseView.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {DataVocabLists} lists
         * @constructor
         */
        initialize: function(options, lists) {
            this.fields = {};
            this.filter = undefined;
            this.lists = [];
            this.vocablists = lists;
        },
        /**
         * @method render
         * @returns {ListTable}
         */
        render: function() {
            this.$el.html(this.compile(Template));
            this.$('table').addClass('table-hover');
            this.elements.body = this.$('table tbody');
            this.elements.head = this.$('table thead');
            return this;
        },
        /**
         * @method renderTable
         * @returns {ListTable}
         */
        renderTable: function() {
            var divBody = '';
            var divHead = '';
            this.elements.body.empty();
            this.elements.head.empty();
            //defaults to using locally stored vocablists
            if (!this.lists.length) {
                this.lists = this.vocablists.models;
            }
            //generates the header section
            if (this.fields) {
                divHead += '<tr>';
                for (var header in this.fields) {
                    divHead += "<th>" + this.fields[header] + "</th>";
                }
                divHead += '</tr>';
            }
            //generates the body section
            if (this.lists.length > 0) {
                for (var i = 0, length = this.lists.length; i < length; i++) {
                    var list = this.lists[i];
                    divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                    for (var field in this.fields) {
                        var fieldValue = list.cid ? list.get(field) : list[field];
                        if (field === 'studyingMode') {
                            if (fieldValue === 'not studying') {
                                divBody += "<td class='list-field-" + field + "'>Not Studying</td>";
                            } else if (fieldValue === 'finished') {
                                divBody += "<td class='list-field-" + field + "'>Finished</td>";
                            } else if (fieldValue === 'adding') {
                                divBody += "<td class='list-field-" + field + "'>Adding</td>";
                            } else {
                                divBody += "<td class='list-field-" + field + "'>Reviewing</td>";
                            }
                        } else {
                            divBody += "<td class='list-field-" + field + "'>" + fieldValue + "</td>";
                        }
                    }
                }
            } else {
                divBody += "<tr><td class='text-center' colspan='" + Object.keys(this.fields).length + "'>";
                divBody += "You don't have any active lists!";
                divBody += "</td></tr>";
            }
            this.elements.body.html(divBody);
            this.elements.head.html(divHead);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {});
        },
        /**
         * @method clear
         * @returns {ListTable}
         */
        clear: function() {
            this.elements.body.empty();
            this.elements.head.empty();
        },
        /**
         * @method filterActive
         * @returns {ListTable}
         */
        filterActive: function() {
            this.filter = this.filterActive;
            this.lists = this.vocablists.getActive();
            this.renderTable();
            return this;
        },
        /**
         * @method set
         * @param {Object} fields
         * @returns {ListTable}
         */
        setFields: function(fields) {
            this.fields = fields ? fields : {};
            this.renderTable();
            return this;
        }
    });

    return ListTable;
});