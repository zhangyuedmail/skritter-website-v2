define([
    'require.text!template/component-list-section-table.html',
    'model/data/VocabList'
], function(template, VocabList) {
    /**
     * @class VocabListSectionTable
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
            this.fields = {};
            this.listId = null;
            this.sections = {};
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(template);
            this.elements.body = this.$('table tbody');
            this.elements.head = this.$('table thead');
            this.renderTable();
            return this;
        },
        /**
         * @method renderTable
         * @returns {Backbone.View}
         */
        renderTable: function() {
            var divBody = '';
            var divHead = '';
            this.elements.body.empty();
            this.elements.head.empty();
            if (this.sections.length > 0) {
                //generates the header section
                divHead += '<tr>';
                for (var header in this.fields) {
                    divHead += "<th>" + this.fields[header] + "</th>";
                }
                divHead += '</tr>';
                //generates the body section
                for (var i = 0, length = this.sections.length; i < length; i++) {
                    var section = this.sections[i];
                    divBody += "<tr id='section-" + section.id + "' class='cursor'>";
                    for (var field in this.fields) {
                        var fieldValue = section[field];
                        if (field === 'rows') {
                            divBody += "<td class='section-field-" + field + "'>" + fieldValue.length + "</td>";
                        } else {
                            divBody += "<td class='section-field-" + field + "'>" + fieldValue + "</td>";
                        }
                    }
                }
            } else {
                //TODO: handle lists without any sections
            }
            this.elements.body.html(divBody);
            this.elements.head.html(divHead);
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
            'vclick table tbody tr': 'handleTableSectionClick'
        },
        /**
         * @method handleTableSectionClick
         * @param {Object} event
         */
        handleTableSectionClick: function(event) {
            var sectionId = event.currentTarget.id.replace('section-', '');
            skritter.router.navigate('vocab/list/' + this.listId + '/' + sectionId, {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method set
         * @param {String} listId
         * @param {Array|Object} sections
         * @param {Object} fields
         * @returns {Backbone.View}
         */
        set: function(listId, sections, fields) {
            this.fields = fields;
            this.listId = listId;
            this.sections = sections;
            return this.render();
        }
    });

    return View;
});