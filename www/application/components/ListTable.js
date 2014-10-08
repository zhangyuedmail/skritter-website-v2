
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
            this.filtered = [];
            this.lists = [];
        },
        /**
         * @method render
         * @returns {ListTable}
         */
        render: function() {
            this.$el.html("<table class='table table-hover list-table'><thead></thead><tbody></tbody></table>");
            return this;
        },
        /**
         * @method renderTable
         * @returns {ListTable}
         */
        renderTable: function() {
            var lists = this.filtered.length ? this.filtered : this.lists;
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
            for (var i = 0, length = lists.length; i < length; i++) {
                var list = lists[i];
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
                            divBody += "<td class='list-field-" + field + "'>Paused</td>";
                        }
                    } else if (field === 'image') {
                        divBody += "<td class='list-image'><img src='http://www.skritter.com/vocab/listimage?list=" + list.id + "' alt=''></td>";
                    } else {
                        divBody += "<td class='list-field-" + field + "'>" + fieldValue + "</td>";
                    }
                }
                divBody += "</tr>";
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
         * @method filterByName
         * @param {Object} criteria
         * @returns {ListTable}
         */
        filterBy: function(criteria) {
            this.filtered = _.filter(this.lists, function(list) {
                for (var criterion in criteria) {
                    if (list[criterion] && Array.isArray(list[criterion])) {
                        var normalizedArray = list[criterion].map(app.fn.toLowerCase);
                        if (normalizedArray.indexOf(criteria[criterion]) > -1) {
                            return true;
                        }
                    } else {
                        if (list[criterion] && list[criterion].toLowerCase().indexOf(criteria[criterion].toLowerCase()) > -1) {
                            return true;
                        }
                    }
                }
            });
            return this;
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
        },
        /**
         * @method sortByStatus
         * @param {Boolean} [desc]
         * @returns {ListTable}
         */
        sortByStatus: function(desc) {
            this.lists =_.sortBy(this.lists, function(list) {
                if (list.studyingMode === 'adding') {
                    return 0 + list.name;
                } else if (list.studyingMode === 'reviewing') {
                    return 1 + list.name;
                } else if (list.studyingMode === 'finished') {
                    return 2 + list.name;
                } else {
                    return 3 + list.name;
                }
            });
            if (desc) {
                this.lists.reverse();
            }
            return this;
        }
    });

    return ListTable;
});