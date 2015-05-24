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
         * @constructor
         */
        initialize: function() {
            this.fields = {};
            this.filtered = [];
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
            for (var i = 0, length = this.filtered.length; i < length; i++) {
                var list = this.filtered[i];
                tableBody += "<tr id='row-" + list.id + "' class='cursor'>";
                for (var field2 in this.fields) {
                    tableBody += "<td class='field-" + field2.toLowerCase() + "'>";
                    switch (field2) {
                        case 'addStatus':
                            tableBody += this.getAddStatus({status: list.get('studyingMode')});
                            break;
                        case 'progress':
                            tableBody += this.getProgressBar({value: list.getPercentAdded()});
                            break;
                        case 'remove':
                            tableBody += '<i class="fa fa-close"></i>';
                            break;
                        case 'status':
                            tableBody += this.getStatus({status: list.get('studyingMode')});
                            break;
                        case 'startAdding':
                            tableBody += '<a href="#">Restart adding</a>';
                            break;
                        case 'stopAdding':
                            tableBody += '<a href="#">Stop adding</a>';
                            break;
                        case 'study':
                            tableBody += '<a href="#">Study list</a>';
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
            this.renderEvents();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .field-name': 'handleClickFieldName',
            'vclick .field-startadding': 'handleClickFieldStartAdding',
            'vclick .field-stopadding': 'handleClickFieldStopAdding',
            'vclick .field-study': 'handleClickFieldStudy'
        },
        /**
         * @method filterBy
         * @param {String} value
         * @returns {ListTable}
         */
        filterBy: function(value) {
            value = value.toLowerCase();
            this.filtered = _.filter(this.lists, function(list) {
                return list.get('name').toLowerCase().indexOf(value) > -1;
            });
            this.renderTable();
            return this;
        },
        /**
         * @method getAddStatus
         * @param {Object} [options]
         * @returns {String}
         */
        getAddStatus: function(options) {
            options = options || {};
            var status = options.status;
            switch (status) {
                case 'adding':
                    return 'Adding';
                case 'finished':
                    return 'Finished';
                case 'not studying':
                    return '<i class="fa fa-plus-circle"></i> Add to queue';
                case 'reviewing':
                    return 'Reviewing';
                default:
                    return 'Unknown';
            }
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
            app.router.navigate('lists/browse/' + listId);
        },
        /**
         * @method handleClickFieldStartAdding
         * @param {Event} event
         */
        handleClickFieldStartAdding: function(event) {
            event.preventDefault();
            var $row = $(event.currentTarget).parent('tr');
            var listId = $row.get(0).id.replace('row-', '');
            var list = app.user.data.vocablists.get(listId);
            if (list) {
                list.set('studyingMode', 'adding');
            }
        },
        /**
         * @method handleClickFieldStopAdding
         * @param {Event} event
         */
        handleClickFieldStopAdding: function(event) {
            event.preventDefault();
            var $row = $(event.currentTarget).parent('tr');
            var listId = $row.get(0).id.replace('row-', '');
            var list = app.user.data.vocablists.get(listId);
            if (list) {
                list.set('studyingMode', 'reviewing');
            }
        },
        /**
         * @method handleClickFieldStudy
         * @param {Event} event
         */
        handleClickFieldStudy: function(event) {
            event.preventDefault();
            var $row = $(event.currentTarget).parent('tr');
            var listId = $row.get(0).id.replace('row-', '');
            app.router.navigate('study/' + listId);
        },
        /**
         * @method set
         * @param {Array} lists
         * @param {Object} fields
         * @returns {ListTable}
         */
        set: function(lists, fields) {
            this.fields = fields || {};
            this.filtered = lists || [];
            this.lists = lists || [];
            this.renderTable();
            return this;
        },
        /**
         * @method sortBy
         * @param {String} field
         * @returns {ListTable}
         */
        sortBy: function(field) {
            this.filtered = _.sortBy(this.filtered, function(list) {
                return list.get(field);
            });
            this.renderTable();
            return this;
        }
    });

    return ListTable;

});