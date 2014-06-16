define([
    'require.text!template/component-list-section-row-table.html'
], function(template) {
    /**
     * @class VocabListSectionRowTable
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
            this.fields = {};
            this.listId = null;
            this.section = null;
            this.rows = [];
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
            var divBody = '';
            var divHead = '';
            this.elements.body.empty();
            this.elements.head.empty();
            if (this.rows.length > 0) {
                //generates the header section
                divHead += '<tr>';
                for (var header in this.fields) {
                    divHead += "<th>" + this.fields[header] + "</th>";
                }
                divHead += '</tr>';
                //generates the body section
                for (var i = 0, length = this.rows.length; i < length; i++) {
                    var row = this.rows[i];
                    divBody += "<tr id='row-" + row.id + "' class='cursor'>";
                    for (var field in this.fields) {
                        var fieldValue = row[field];
                        if (field === 'vocabId') {
                            divBody += "<td class='row-field-" + field + "'>";
                            divBody += skritter.fn.mapper.fromBase(fieldValue);
                            if (fieldValue !== row.tradVocabId) {
                                divBody += ' (' + skritter.fn.mapper.fromBase(row.tradVocabId) + ')';
                            }
                            divBody += "</td>";
                        } else {
                            divBody += "<td class='row-field-" + field + "'>" + fieldValue + "</td>";
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
            //TODO: make an event that connects vocabs with the info view
        },
        /**
         * @method set
         * @param {String} listId
         * @param {Array|Object} section
         * @param {Object} fields
         * @returns {Backbone.View}
         */
        set: function(listId, section, fields) {
            this.fields = fields;
            this.listId = listId;
            this.section = section;
            this.rows = section.rows;
            return this.renderTable();
        }
    });

    return View;
});