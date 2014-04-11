/**
 * @module Skritter
 * @submodule Views
 * @param templateVocabList
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-list.html'
], function(templateVocabList) {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabList.id = null;
            VocabList.list = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            if (VocabList.list) {
                console.log(VocabList.list);
                var divBody = '';
                this.$('table tbody').html(divBody);
                this.$('#list-title').text(VocabList.list.name);
                this.$('#list-description').text(VocabList.list.description);
                for (var i = 0, length = VocabList.list.sections.length; i < length; i++) {
                    var section = VocabList.list.sections[i];
                    divBody += "<tr id='" + section.id + "'>";
                    divBody += "<td class='section-name'>" + section.name + "</td>";
                    divBody += "<td class='section-count'>" + section.rows.length + " words</td>";
                    divBody += "</tr>";
                }
                this.$('table tbody').html(divBody);
            }
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
        },
        /**
         * @method clear
         */
        clear: function() {
            this.$('#list-title').html('');
            this.$('#list-description').html('');
        },
        /**
         * @method load
         * @param listId
         */
        load: function(listId) {
            VocabList.id = listId;
            this.clear();
            skritter.api.getVocabList(listId, null, _.bind(function(list) {
                VocabList.list = list;
                this.render();
            }, this));
        },
        /**
         * @method toggleMode
         * @param {String} studyingMode
         */
        toggleMode: function(studyingMode) {
            skritter.api.updateVocabList({id: VocabList.list.id, studyingMode: studyingMode}, _.bind(function(list) {
                VocabList.list = list;                
                this.render();
            }, this));
        }
    });

    return VocabList;
});