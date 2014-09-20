
/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView',
    'require.text!templates/table.html',
    'collections/data/DataVocabLists'
], function(BaseView, Template, DataVocabLists) {
    /**
     * @class ListTable
     * @extend BaseView
     */
    var ListTable = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.fields = {};
            this.lists = undefined;
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
            this.renderTable();
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
                    var list = this.lists.at(i);
                    divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                    for (var field in this.fields) {
                        var fieldValue = list.get(field);
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
            return _.extend({}, BaseView.prototype.events, {
            });
        },
        /**
         * @method set
         * @param {DataVocabLists} lists
         * @param {Object} fields
         * @returns {ListTable}
         */
        set: function(lists, fields) {
            this.fields = fields ? fields : {};
            this.lists = lists;
            return this;
        }
    });

    return ListTable;
});