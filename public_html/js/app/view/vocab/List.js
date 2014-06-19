define([
    'require.text!template/vocab-list.html',
    'base/View',
    'view/component/ListSectionTable'
], function(template, BaseView, ListSectionTable) {
    /**
     * @class VocabList
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.list = null;
            this.listId = null;
            this.sections = new ListSectionTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.setTitle('List');
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.sections.setElement(this.elements.listSections).render();
            return this;
        },
        /**
         * @method renderList
         * @returns {Backbone.View}
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
            this.sections.set(this.listId, this.list.sections, {
                name: 'Name',
                rows: 'Items'
            });
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.buttonEnableList = this.$('.button-enable-list');
            this.elements.buttonStartList = this.$('.button-start-list');
            this.elements.buttonDisableList = this.$('.button-disable-list');
            this.elements.buttonPauseList = this.$('.button-pause-list');
            this.elements.listDescription = this.$('.list-description');
            this.elements.listName = this.$('.list-name');
            this.elements.listOptions = this.$('.button-list-options');
            this.elements.listSections = this.$('#list-sections');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
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
                    this.renderList();
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
                    this.renderList();
                }
                skritter.modal.hide();
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
                    this.renderList();
                }
                skritter.modal.hide();
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
                    this.renderList();
                }
                skritter.modal.hide();
            }, this));
        }
    });

    return View;
});