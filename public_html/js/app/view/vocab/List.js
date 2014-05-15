/**
 * @module Skritter
 * @submodule View
 * @param templateVocabList
 * @param ListSectionTable
 * @param ListSectionRowTable
 * @param VocabList
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-list.html',
    'view/component/ListSectionTable',
    'view/component/ListSectionRowTable',
    'model/data/VocabList'
], function(templateVocabList, ListSectionTable, ListSectionRowTable, VocabList) {
    /**
     * @class List
     */
    var List = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.id = null;
            this.model = new VocabList();
            this.sectionId = null;
            this.sectionRowTable = new ListSectionRowTable();
            this.sectionTable = new ListSectionTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            this.sectionTable.setElement(this.$('#section-table')).render();
            this.sectionRowTable.setElement(this.$('#row-table')).render();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-disable-studying': 'disableList',
            'vclick .button-enable-studying': 'enableList',
            'vclick .button-pause-studying': 'pauseList',
            'vclick .button-start-studying': 'startList'
        },
        /**
         * @method disableList
         * @param {Object} event
         */
        disableList: function(event) {
            skritter.modal.show('loading').set('.modal-body', "Saving Changes");
            skritter.api.updateVocabList({id: this.model.id, studyingMode: 'not studying'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.model.set(list);
                    this.loadList();
                }
                skritter.modal.hide();
            }, this));
            event.preventDefault();
        },
        /**
         * @method enableList
         * @param {Object} event
         */
        enableList: function(event) {
            skritter.modal.show('loading').set('.modal-body', "Saving Changes");
            skritter.api.updateVocabList({id: this.model.id, studyingMode: 'adding'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.model.set(list);
                    this.loadList();
                }
                skritter.modal.hide();
            }, this));
            event.preventDefault();
        },
        /**
         * @method loadList
         */
        loadList: function() {
            this.$('#list-name').text(this.model.get('name'));
            if (this.model.has('categories'))
                this.$('#list-categories').text(this.model.get('categories').join(', '));
            this.$('#list-description').text(this.model.get('description'));
            this.$('#list-people-studying').text(this.model.get('peopleStudying'));
            this.$('#settings button').hide();
            switch (this.model.get('studyingMode')) {
                case 'not studying':
                    this.$('#list-status').html("<span class='text-danger'>You haven't enabled this list for studying yet.</span>");
                    this.$('#settings .button-enable-studying').show();
                    break;
                case 'adding':
                    this.$('#list-status').html("<span class='text-success'>You are studying and adding items from this list.</span>");
                    this.$('#settings .button-pause-studying').show();
                    this.$('#settings .button-disable-studying').show();
                    break;
                case 'reviewing':
                    this.$('#list-status').html("<span class='text-warning'>You are studying this list, but not adding new items.</span>");
                    this.$('#settings .button-start-studying').show();
                    this.$('#settings .button-disable-studying').show();
                    break;
                case 'finished':
                    this.$('#list-status').html("<span class='text-muted'>You have added all of the items from this list.</span>");
                    this.$('#settings .button-disable-studying').show();
                    break;
            }
            if (this.id && this.sectionId) {
                this.loadSectionRows();
            } else {
                this.loadSections();
            }
        },
        /**
         * @method loadSections
         */
        loadSections: function() {
            this.sectionTable.set(this.id, this.model.get('sections'), {
                name: 'Section Name',
                rows: ''
            });
            this.$('#overview').removeClass('hidden');
            this.$('#settings').removeClass('hidden');
            this.$('#sections').removeClass('hidden');
            this.$('#rows').addClass('hidden');
        },
        /**
         * @method loadSectionRows
         */
        loadSectionRows: function() {
            var section = _.find(this.model.get('sections'), {id: this.sectionId});
            this.sectionRowTable.set(section.rows, {
                vocabId: 'ID'
            });
            this.$('#section-name').text(section.name);
            this.$('#overview').removeClass('hidden');
            this.$('#settings').addClass('hidden');
            this.$('#sections').addClass('hidden');
            this.$('#rows').removeClass('hidden');
        },
        /**
         * @method pauseList
         * @param {Object} event
         */
        pauseList: function(event) {
            skritter.modal.show('loading').set('.modal-body', "Saving Changes");
            skritter.api.updateVocabList({id: this.model.id, studyingMode: 'reviewing'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.model.set(list);
                    this.loadList();
                }
                skritter.modal.hide();
            }, this));
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method selectSection
         * @param {Object} event
         */
        selectSection: function(event) {
            var id = event.currentTarget.id.replace('section-', '');
            this.sectionId = id;
            this.loadSectionRows();
            event.preventDefault();
        },
        /**
         * @method set
         * @param {String} listId
         * @param {String} sectionId
         * @returns {Backbone.View}
         */
        set: function(listId, sectionId) {
            this.id = listId;
            this.sectionId = sectionId;
            skritter.modal.show('loading').set('.modal-body', sectionId ? 'Loading Section' : 'Loading this');
            skritter.api.getVocabList(listId, null, _.bind(function(list, status) {
                if (status === 200) {
                    this.model.set(list);
                    this.loadList();
                } else {
                    skritter.router.navigate('vocab/list', {replace: true, trigger: true});
                }
                skritter.modal.hide();
            }, this));
            return this;
        },
        /**
         * @method startList
         * @param {Object} event
         */
        startList: function(event) {
            skritter.modal.show('loading').set('.modal-body', "Saving Changes");
            skritter.api.updateVocabList({id: this.model.id, studyingMode: 'adding'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.model.set(list);
                    this.loadList();
                }
                skritter.modal.hide();
            }, this));
            event.preventDefault();
        }
    });

    return List;
});