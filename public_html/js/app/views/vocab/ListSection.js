/**
 * @module Skritter
 * @submodule Views
 * @param templateVocabListSection
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-list-section.html'
], function(templateVocabListSection) {
    /**
     * @class VocabList
     */
    var ListSection = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            ListSection.id = null;
            ListSection.list = null;
            ListSection.listId = null;
            ListSection.section = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListSection);
            if (ListSection.list) {
                this.$('#list-title').text(ListSection.list.name);
            }
            if (ListSection.section) {
                var divBody = '';
                this.$('table tbody').html(divBody);
                this.$('#section-title').text(ListSection.section.name);
                for (var i = 0, length = ListSection.section.rows.length; i < length; i++) {
                    var row = ListSection.section.rows[i];
                    divBody += "<tr id='vocab-" + row.vocabId + "' class='cursor'>";
                    divBody += "<td class='writing'>" + skritter.fn.simptrad.fromBase(row.vocabId) + "</td>";
                    divBody += "</tr>";
                    if (row.vocabId !== row.tradVocabId) {
                        divBody += "<tr id='vocab-" + row.tradVocabId + "' class='cursor'>";
                        divBody += "<td class='writing'>" + skritter.fn.simptrad.fromBase(row.tradVocabId) + "</td>";
                        divBody += "</tr>";
                    }
                }
                this.$('table tbody').html(divBody);
            }
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
            'click.ListSection #vocab-list-section-view #back-button': 'handleBackButtonClicked'
        },
        /**
         * @method handleBackButtonClicked
         * @param {Object} event
         */
        handleBackButtonClicked: function(event) {
            skritter.router.navigate('vocab/list/' + ListSection.listId, {trigger: true});
            event.preventDefault();
        },
        /**
         * @method clear
         */
        clear: function() {
        },
        /**
         * @method load
         * @param listId
         * @param sectionId
         */
        load: function(listId, sectionId) {
            var self = this;
            ListSection.id = sectionId;
            ListSection.listId = listId;
            var start = function() {
                skritter.api.getVocabList(listId, null, function(list) {
                    ListSection.list = list;
                ListSection.section = _.find(list.sections, {id: sectionId});
                    skritter.modals.hide(_.bind(self.render, self));
                });
            };
            skritter.modals.show('default', start).set('.modal-header', false).set('.modal-body', 'LOADING', 'text-center').set('.modal-footer', false);
        }
    });

    return ListSection;
});