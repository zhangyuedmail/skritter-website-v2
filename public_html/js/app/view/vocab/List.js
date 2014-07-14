define([
    'require.text!template/vocab-list.html',
    'view/View',
    'view/component/ListSectionTable'
], function(template, View, ListSectionTable) {
    /**
     * @class VocabList
     */
    var VocabList = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
            this.list = null;
            this.listId = null;
            this.sections = new ListSectionTable();
        },
        /**
         * @method render
         * @returns {VocabList}
         */
        render: function() {
            this.setTitle('List');
            this.$el.html(_.template(template, skritter.strings));
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.sections.setElement(this.elements.listSections).render();
            return this;
        },
        /**
         * @method renderList
         * @returns {VocabList}
         */
        renderList: function() {
            this.elements.listOptions.hide();
            switch (this.list.studyingMode) {
                case 'not studying':
                    this.elements.buttonEnableList.show();
                    break;
                case 'adding':
                    this.elements.buttonPauseList.show();
                    this.elements.buttonDisableList.show();
                    break;
                case 'reviewing':
                    this.elements.buttonStartList.show();
                    this.elements.buttonDisableList.show();
                    break;
                case 'finished':
                    this.elements.buttonDisableList.show();
                    break;
            }
            this.elements.listDescription.text(this.list.description);
            this.elements.listName.text(this.list.name);
            if (this.list.creator) {
                this.elements.listCreator.text(this.list.creator);
            } else {
                this.elements.listCreator.parent().hide();
            }
            if (this.list.peopleStudying) {
                this.elements.peopleStudying.text(this.list.peopleStudying);
            } else {
                this.elements.peopleStudying.parent().hide();
            }
            this.sections.set(this.listId, this.list.sections, {
                name: 'Name',
                rows: 'Items'
            });
            return this;
        },
        /**
         * @method loadElements
         */
        loadElements: function() {
            this.elements.buttonEnableList = this.$('.button-enable-list');
            this.elements.buttonStartList = this.$('.button-start-list');
            this.elements.buttonDisableList = this.$('.button-disable-list');
            this.elements.buttonPauseList = this.$('.button-pause-list');
            this.elements.listCreator = this.$('#list-creator');
            this.elements.listDescription = this.$('.list-description');
            this.elements.listName = this.$('.list-name');
            this.elements.listSections = this.$('#list-sections');
            this.elements.listOptions = this.$('.button-list-options');
            this.elements.peopleStudying = this.$('#people-studying');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, View.prototype.events, {
                'vclick .button-start-list': 'handleStartListClick',
                'vclick .button-pause-list': 'handlePauseListClick',
                'vclick .button-enable-list': 'handleEnableListClick',
                'vclick .button-disable-list': 'handleDisableListClick'
            });
        },
        /**
         * @method disableList
         */
        disableList: function() {
            skritter.modal.show('loading').set('.message', 'Disabling List');
            skritter.api.updateVocabList({id: this.listId, studyingMode: 'not studying'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.list = list;
                    skritter.user.data.vocablists.remove(list).uncache(function() {
                        skritter.modal.hide();
                    });
                    this.renderList();
                    return;
                }
                skritter.modal.hide();
            }, this));
        },
        /**
         * @method enableList
         */
        enableList: function() {
            skritter.modal.show('loading').set('.message', 'Enabling List');
            skritter.api.updateVocabList({id: this.listId, studyingMode: 'adding'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.list = list;
                    skritter.user.data.vocablists.add(list, {merge: true});
                    this.renderList();
                }
                skritter.user.data.vocablists.cache(function() {
                    skritter.modal.hide();
                });
            }, this));
        },
        /**
         * @method handleDisableListClick
         * @param {Object} event
         */
        handleDisableListClick: function(event) {
            this.disableList();
            event.preventDefault();
        },
        /**
         * @method handleEnableListClick
         * @param {Object} event
         */
        handleEnableListClick: function(event) {
            this.enableList();
            event.preventDefault();
        },
        /**
         * @method handlePauseListClick
         * @param {Object} event
         */
        handlePauseListClick: function(event) {
            this.pauseList();
            event.preventDefault();
        },
        /**
         * @method handleStartListClick
         * @param {Object} event
         */
        handleStartListClick: function(event) {
            this.startList();
            event.preventDefault();
        },
        /**
         * @method loadList
         */
        loadList: function() {
            this.elements.listOptions.hide();
            skritter.modal.show('loading').set('.message', 'Loading List');
            skritter.api.getVocabList(this.listId, null, _.bind(function(list) {
                this.list = list;
                this.renderList();
                skritter.modal.hide();
            }, this));
            return this;
        },
        /**
         * @method pauseList
         */
        pauseList: function() {
            skritter.modal.show('loading').set('.message', 'Pausing List');
            skritter.api.updateVocabList({id: this.listId, studyingMode: 'reviewing'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.list = list;
                    skritter.user.data.vocablists.add(list, {merge: true});
                    this.renderList();
                }
                skritter.user.data.vocablists.cache(function() {
                    skritter.modal.hide();
                });
            }, this));
        },
        /**
         * @method set
         * @param {String} listId
         * @returns {Backbone.View}
         */
        set: function(listId) {
            this.listId = listId;
            this.loadList();
            return this;
        },
        /**
         * @method enableList
         */
        startList: function() {
            skritter.modal.show('loading').set('.message', 'Starting List');
            skritter.api.updateVocabList({id: this.listId, studyingMode: 'adding'}, _.bind(function(list, status) {
                if (status === 200) {
                    this.list = list;
                    skritter.user.data.vocablists.add(list, {merge: true});
                    this.renderList();
                }
                skritter.user.data.vocablists.cache(function() {
                    skritter.modal.hide();
                });
            }, this));
        }
    });

    return VocabList;
});