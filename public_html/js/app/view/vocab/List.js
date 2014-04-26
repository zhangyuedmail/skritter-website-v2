/**
 * @module Skritter
 * @submodule View
 * @param templateVocabList
 * @param ListSectionTable
 * @param VocabList
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-list.html',
    'view/component/ListSectionTable',
    'model/data/VocabList'
], function(templateVocabList, ListSectionTable, VocabList) {
    /**
     * @class List
     */
    var List = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            List.id = null;
            List.model = new VocabList();
            List.table = new ListSectionTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            List.table.setElement(this.$('#section-table')).render();
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
            skritter.api.updateVocabList({id: List.model.id, studyingMode: 'not studying'}, _.bind(function(list, status) {
                if (status === 200) {
                    List.model.set(list);
                    this.load();
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
            skritter.api.updateVocabList({id: List.model.id, studyingMode: 'adding'}, _.bind(function(list, status) {
                if (status === 200) {
                    List.model.set(list);
                    this.load();
                }
                skritter.modal.hide();
            }, this));
            event.preventDefault();
        },
        /**
         * @method load
         */
        load: function() {
            this.$('#overview').removeClass('hidden');
            this.$('#settings').removeClass('hidden');
            this.$('#list-name').text(List.model.get('name'));
            if (List.model.has('categories'))
                this.$('#list-categories').text(List.model.get('categories').join(', '));
            this.$('#list-description').text(List.model.get('description'));
            this.$('#list-people-studying').text(List.model.get('peopleStudying'));
            this.$('#settings button').hide();
            switch (List.model.get('studyingMode')) {
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
        },
        /**
         * @method pauseList
         * @param {Object} event
         */
        pauseList: function(event) {
            skritter.modal.show('loading').set('.modal-body', "Saving Changes");
            skritter.api.updateVocabList({id: List.model.id, studyingMode: 'reviewing'}, _.bind(function(list, status) {
                if (status === 200) {
                    List.model.set(list);
                    this.load();
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
         * @method set
         * @param {String} listId
         * @returns {Backbone.View}
         */
        set: function(listId) {
            List.id = listId;
            List.table.showLoading();
            skritter.api.getVocabList(listId, null, _.bind(function(list) {
                List.model.set(list);
                List.table.set(listId, list.sections, {
                    name: 'Section Name',
                    rows: ''
                });
                List.table.hideLoading();
                this.load();
            }, this));
            return this;
        },
        /**
         * @method startList
         * @param {Object} event
         */
        startList: function(event) {
            skritter.modal.show('loading').set('.modal-body', "Saving Changes");
            skritter.api.updateVocabList({id: List.model.id, studyingMode: 'adding'}, _.bind(function(list, status) {
                if (status === 200) {
                    List.model.set(list);
                    this.load();
                }
                skritter.modal.hide();
            }, this));
            event.preventDefault();
        }
    });

    return List;
});