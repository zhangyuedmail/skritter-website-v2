var GelatoComponent = require('gelato/component');

/**
 * @class VocablistTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.fields = {name: 'Name', progress: 'Progress'};
        this.lists = [];
        this.type = null;
        this.listenTo(app.user.data.vocablists, 'fetch', this.update);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/vocablist-table/template'),
    /**
     * @method render
     * @returns {VocablistTable}
     */
    render: function() {
        this.renderTemplate();
        this.update();
        return this;
    },
    /**
     * @method renderTable
     * @returns {VocablistTable}
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
                    case 'addStatus':
                        tableBody += this.getAddStatus({status: list.get('studyingMode')});
                        break;
                    case 'progress':
                        tableBody += this.getProgressBar({value: list.getProgress()});
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
     * @method setType
     * @param {String} type
     * @returns {VocablistTable}
     */
    setType: function(type) {
        this.type = type;
        this.update();
        return this;
    },
    /**
     * @method update
     */
    update: function() {
        switch (this.type) {
            case 'adding':
                this.lists = app.user.data.vocablists.getAdding();
                break;
            case 'reviewing':
                this.lists = app.user.data.vocablists.getReviewing();
                break;
            default:
                this.lists = app.user.data.vocablists.models;
        }
        this.renderTable();
    }
});
