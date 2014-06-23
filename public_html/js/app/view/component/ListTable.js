define([
    'require.text!template/component-list-table.html',
    'collection/data/VocabLists'
], function(template, VocabLists) {
    /**
     * @class VocabListsTable
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
            this.fields = {};
            this.filteredLists = null;
            this.lists = new VocabLists();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(template);
            this.elements.body = this.$('table tbody');
            this.elements.head = this.$('table thead');
            return this;
        },
        /**
         * @method renderTable
         * @returns {Backbone.View}
         */
        renderTable: function() {
            var lists = this.getLists();
            var divBody = '';
            var divHead = '';
            this.elements.body.empty();
            this.elements.head.empty();
            if (this.fields) {
                //generates the header section
                divHead += '<tr>';
                for (var header in this.fields) {
                    divHead += "<th>" + this.fields[header] + "</th>";
                }
                divHead += '</tr>';
            }
            if (lists.length > 0) {
                //generates the body section
                for (var i = 0, length = lists.length; i < length; i++) {
                    var list = lists.at(i);
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
                //TODO: handle users who haven't added any lists
            }
            this.elements.body.html(divBody);
            this.elements.head.html(divHead);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick table tbody tr': 'handleTableRowClick'
        },
        /**
         * @method filterByStatus
         * @param {Array|String} status
         * @returns {Backbone.View}
         */
        filterByStatus: function(status) {
            this.filteredLists = this.lists.filterByStatus(status);
            return this.renderTable();
        },
        /**
         * @method filterByTitle
         * @param {Array|String} title
         * @returns {Backbone.View}
         */
        filterByTitle: function(title) {
            this.filteredLists = this.lists.filterByTitle(title);
            return this.renderTable();
        },
        /**
         * @method getLists
         * @returns {Backbone.Collection}
         */
        getLists: function() {
            return this.filteredLists ? this.filteredLists : this.lists;
        },
        /**
         * @method handleTableRowClick
         * @param {Object} event
         */
        handleTableRowClick: function(event) {
            var listId = event.currentTarget.id.replace('list-', '');
            skritter.router.navigate('vocab/list/' + listId, {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method set
         * @param {Array|Object} lists
         * @param {Object} fields
         * @returns {Backbone.View}
         */
        set: function(lists, fields) {
            this.fields = fields;
            this.lists.reset();
            this.lists.add(lists);
            return this.renderTable();
        }
    });

    return View;
});