/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/list-table.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class ListTable
     * @extends GelatoComponent
     */
    var ListTable = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
            this.fields = {};
            this.lists = [];
        },
        /**
         * @method render
         * @returns {ListTable}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderTable
         * @returns {ListTable}
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
            for (var i = 0, length = this.lists.length; i < length; i++) {
                var list = this.lists[i];
                tableBody += "<tr id='row-" + list.id + "' class='cursor'>";
                for (var field2 in this.fields) {
                    tableBody += "<td class='field-" + field2.toLowerCase() + "'>";
                    switch (field2) {
                        case 'progress':
                            tableBody += this.getProgressBar({value: list.getPercentAdded()});
                            break;
                        case 'status':
                            tableBody += this.getStatus({status: list.get('studyingMode')});
                            break;
                        default:
                            tableBody += list.get(field2);
                    }
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
        events: {
            'vclick .field-name': 'handleClickFieldName'
        },
        /**
         * @method getProgressBar
         * @param {Object} [options]
         * @returns {String}
         */
        getProgressBar: function(options) {
            options = options || {};
            var value = options.value || 0;
            return [
                '<div class="progress">',
                '<div class="progress-bar" role="progressbar" style="width: ' + value + '%;">',
                '</div></div>'
            ].join('');

        },
        /**
         * @method getStatus
         * @param {Object} [options]
         * @returns {String}
         */
        getStatus: function(options) {
            options = options || {};
            var status = options.status;
            switch (status) {
                case 'adding':
                    return 'Adding';
                case 'finished':
                    return 'Finished';
                case 'not studying':
                    return 'Not Studying';
                case 'reviewing':
                    return 'Reviewing';
                default:
                    return 'Unknown';
            }
        },
        /**
         * @method handleClickFieldName
         * @param {Event} event
         */
        handleClickFieldName: function(event) {
            event.preventDefault();
            var $row = $(event.currentTarget).parent('tr');
            var listId = $row.get(0).id.replace('row-', '');
            this.app.router.navigate('lists/browse/' + listId);
        },
        /**
         * @method set
         * @param {Array} lists
         * @param {Object} fields
         * @returns {ListTable}
         */
        set: function(lists, fields) {
            this.fields = fields || {};
            this.lists = lists || [];
            this.renderTable();
            return this;
        }
    });

    return ListTable;

});