
/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView'
], function(BaseView) {
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
            this.fields = {name: 'Name'};
            this.lists = [];
        },
        /**
         * @method render
         * @returns {ListTable}
         */
        render: function() {
            this.$el.html("<table class='table table-hover'><thead></thead><tbody></tbody></table>");
            return this;
        },
        /**
         * @method renderTable
         * @returns {ListTable}
         */
        renderTable: function() {
            var divBody = '';
            var divHead = '';
            this.$('table tbody').empty();
            this.$('table thead').empty();
            //generates the header section
            if (this.fields) {
                divHead += '<tr>';
                for (var header in this.fields) {
                    divHead += "<th>" + this.fields[header] + "</th>";
                }
                divHead += '</tr>';
            }
            //generates the body section
            for (var i = 0, length = this.lists.length; i < length; i++) {
                var list = this.lists[i];
                divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                for (var field in this.fields) {
                    var fieldValue = list[field];
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
                    } else if (field === 'image') {
                        divBody += "<td class='list-image'><img src='http://www.skritter.com/vocab/listimage?list=" + list.id + "' alt=''></td>";
                    } else {
                        divBody += "<td class='list-field-" + field + "'>" + fieldValue + "</td>";
                    }
                }
            }
            this.$('table thead').html(divHead);
            this.$('table tbody').html(divBody);
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
            this.$('table thead').empty();
            this.$('table tbody').empty();
        },
        /**
         * @method set
         * @param {Object} fields
         * @param {Array|Object} lists
         * @returns {ListTable}
         */
        set: function(fields, lists) {
            this.setFields(fields).setLists(lists);
            return this;
        },
        /**
         * @method setFields
         * @param {Object} fields
         * @returns {ListTable}
         */
        setFields: function(fields) {
            this.fields = fields || {name: 'Name'};
            return this;
        },
        /**
         * @method setLists
         * @param {Array|Object} lists
         * @returns {ListTable}
         */
        setLists: function(lists) {
            this.lists = Array.isArray(lists) ? lists : [lists];
            return this;
        },
        /**
         * @method sortByName
         * @param {Boolean} [desc]
         * @returns {ListTable}
         */
        sortByName: function(desc) {
            this.lists =_.sortBy(this.lists, function(list) {
                return list.name;
            });
            if (desc) {
                this.lists.reverse();
            }
            return this;
        }
    });

    return ListTable;
});