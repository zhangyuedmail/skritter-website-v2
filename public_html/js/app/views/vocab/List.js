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
            VocabList.buttonAdd = null;
            VocabList.buttonEdit = null;
            VocabList.buttonPause = null;
            VocabList.buttonStop = null;
            VocabList.labelComplete = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            this.clear();
            if (VocabList.list) {
                var divBody = '';
                this.$('table tbody').html(divBody);
                this.$('#list-title').text(VocabList.list.name);
                this.$('#list-description').text(VocabList.list.description);
                for (var i = 0, length = VocabList.list.sections.length; i < length; i++) {
                    var section = VocabList.list.sections[i];
                    divBody += "<tr id='section-" + section.id + "' class='cursor'>";
                    divBody += "<td class='section-name'>" + section.name + "</td>";
                    divBody += "<td class='section-count'>" + section.rows.length + " words</td>";
                    divBody += "</tr>";
                }
                switch (VocabList.list.studyingMode) {
                    case 'adding':
                        VocabList.buttonPause.show();
                        VocabList.buttonStop.show();
                        break;
                    case 'reviewing':
                        VocabList.buttonAdd.show();
                        VocabList.buttonStop.show();
                        break;
                    case 'not studying':
                        VocabList.buttonAdd.show();
                        break;
                    default:
                        VocabList.labelComplete.show();
                        break;
                }
                this.$('table tbody').html(divBody);
                this.$('#content-container').show();
            } else {
                this.$('#content-container').hide();
            }
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
            'click.VocabList #vocab-list-view #add-button': 'handleAddButtonClicked',
            'click.VocabList #vocab-list-view #back-button': 'handleBackButtonClicked',
            'click.VocabList #vocab-list-view #pause-button': 'handlePauseButtonClicked',
            'click.VocabList #vocab-list-view #stop-button': 'handleStopButtonClicked',
            'click.VocabList #vocab-list-view #sections table tr': 'handleVocabListSectionClicked'
        },
        /**
         * @method handleAddButtonClicked
         * @param {Object} event
         */
        handleAddButtonClicked: function(event) {
            this.toggleMode('adding');
            event.preventDefault();
        },
        /**
         * @method handleBackButtonClicked
         * @param {Object} event
         */
        handleBackButtonClicked: function(event) {
            skritter.router.back();
            event.preventDefault();
        },
        /**
         * @method handlePauseButtonClicked
         * @param {Object} event
         */
        handlePauseButtonClicked: function(event) {
            this.toggleMode('reviewing');
            event.preventDefault();
        },
        /**
         * @method handleStopButtonClicked
         * @param {Object} event
         */
        handleStopButtonClicked: function(event) {
            this.toggleMode('not studying');
            event.preventDefault();
        },
        /**
         * @method handleVocabListSectionClicked
         * @param {Object} event
         */
        handleVocabListSectionClicked: function(event) {
            var sectionId = event.currentTarget.id.replace('section-', '');
            skritter.router.navigate('vocab/list/' + VocabList.id + '/' + sectionId, {trigger: true});
            event.preventDefault();
        },
        /**
         * @method clear
         */
        clear: function() {
            VocabList.buttonAdd = this.$('#add-button').hide();
            VocabList.buttonEdit = this.$('#edit-button').hide();
            VocabList.buttonPause = this.$('#pause-button').hide();
            VocabList.buttonStop = this.$('#stop-button').hide();
            VocabList.labelComplete = this.$('#label-complete').hide();
            this.$('#list-title').html('');
            this.$('#list-description').html('');
        },
        /**
         * @method load
         * @param listId
         */
        load: function(listId) {
            var self = this;
            VocabList.id = listId;
            var start = function() {
                skritter.api.getVocabList(listId, null, function(list) {
                    VocabList.list = list;
                    skritter.modals.hide(_.bind(self.render, self));
                });
            };
            skritter.modals.show('default', start).set('.modal-header', false).set('.modal-body', 'LOADING LIST', 'text-center').set('.modal-footer', false);
        },
        /**
         * @method toggleMode
         * @param {String} studyingMode
         */
        toggleMode: function(studyingMode) {
            var self = this;
            var start = function() {
                skritter.api.updateVocabList({id: VocabList.list.id, studyingMode: studyingMode}, function(list) {
                    VocabList.list = list;
                    skritter.modals.hide(_.bind(self.render, self));
                });
            };
            skritter.modals.show('default', start).set('.modal-header', false).set('.modal-body', 'SAVING CHANGES', 'text-center').set('.modal-footer', false);
        }
    });

    return VocabList;
});