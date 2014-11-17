/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/list.html',
    'components/ListSectionTable'
], function(BasePage, TemplateMobile, ListSectionTable) {
    /**
     * @class PageList
     * @extends BasePage
     */
    var PageList = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'List';
            this.list = undefined;
            this.listId = undefined;
            this.removed = false;
            this.table = new ListSectionTable();
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PageList}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.$('.list-controls button').hide();
            this.table.setElement(this.$('.section-table-container')).render();
            this.resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageList}
         */
        renderElements: function() {
            this.$('.list-controls button').hide();
            switch (this.list.studyingMode) {
                case 'adding':
                    this.$('#button-pause').show();
                    break;
                case 'finished':
                    this.$('#button-remove').show();
                    break;
                case 'reviewing':
                    this.$('#button-resume').show();
                    this.$('#button-remove').show();
                    break;
                case 'not studying':
                    this.$('#button-add').show();
                    break;
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick table tr': 'handleTableRowClicked',
            'vclick #button-add-section': 'handleButtonAddSectionClicked',
            'vclick #button-add': 'handleButtonAddClicked',
            'vclick #button-pause': 'handleButtonPauseClicked',
            'vclick #button-remove': 'handleButtonRemoveClicked',
            'vclick #button-resume': 'handleButtonResumeClicked',
            'vclick #button-save': 'handleSaveButtonClicked',
            'vclick .section-field-remove': 'handleSectionRemoveButtonClicked'
        }),
        /**
         * @method handleButtonAddSectionClicked
         * @param {Event} event
         */
        handleButtonAddSectionClicked: function(event) {
            event.preventDefault();
            var self = this;
            app.dialogs.show('list-add-section').element('.modal-title span').text('Add Section');
            app.dialogs.element('.section-add').on('vclick', function() {
                var name = app.dialogs.element('#section-name').val();
                self.table.addSection({name: name, deleted: false, rows: []});
                self.table.renderTable();
                app.dialogs.hide();
            });
        },
        /**
         * @method handleTableRowClicked
         * @param {Event} event
         */
        handleButtonAddClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('List', 'click', 'add');
            app.dialogs.show().element('.message-title').text('Updating');
            app.dialogs.element('.message-text').text('ADDING LIST');
            app.api.updateVocabList({
                id: this.listId,
                studyingMode: 'adding'
            }, function(list) {
                app.user.data.vocablists.add(list, {merge: true});
                app.dialogs.hide(function() {
                    app.router.navigate('list/sort/my-lists', {trigger: true});
                });
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method handleButtonPauseClicked
         * @param {Event} event
         */
        handleButtonPauseClicked: function(event) {
            event.preventDefault();
            var self = this;
            app.analytics.trackEvent('List', 'click', 'pause');
            app.dialogs.show().element('.message-title').text('Updating');
            app.dialogs.element('.message-text').text('PAUSING LIST');
            app.api.updateVocabList({
                id: this.listId,
                studyingMode: 'reviewing'
            }, function(list) {
                app.user.data.vocablists.add(list, {merge: true});
                self.list = list;
                self.renderElements();
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method handleButtonRemoveClicked
         * @param {Event} event
         */
        handleButtonRemoveClicked: function(event) {
            event.preventDefault();
            var self = this;
            app.analytics.trackEvent('List', 'click', 'resume');
            app.dialogs.show().element('.message-title').text('Updating');
            app.dialogs.element('.message-text').text('REMOVING LIST');
            async.series([
                function(callback) {
                    app.api.updateVocabList({
                        id: self.listId,
                        studyingMode: 'not studying'
                    }, function(list) {
                        self.list = list;
                        app.user.data.vocablists.add(list, {merge: true});
                        callback();
                    }, function() {
                        callback();
                    });
                }
            ], function() {
                self.renderElements();
                app.dialogs.hide();
            });

        },
        /**
         * @method handleButtonResumeClicked
         * @param {Event} event
         */
        handleButtonResumeClicked: function(event) {
            event.preventDefault();
            var self = this;
            app.analytics.trackEvent('List', 'click', 'resume');
            app.dialogs.show().element('.message-title').text('Updating');
            app.dialogs.element('.message-text').text('RESUMING LIST');
            app.api.updateVocabList({
                id: this.listId,
                studyingMode: 'adding'
            }, function(list) {
                self.list = list;
                app.user.data.vocablists.add(list, {merge: true});
                self.renderElements();
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method handleSaveButtonClicked
         * @param {Event} event
         */
        handleSaveButtonClicked: function(event) {
            event.preventDefault();
            var self = this;
            async.series([
                function(callback) {
                    if (self.removed) {
                        app.dialogs.show('confirm').element('.modal-title span').text('Sections Removed');
                        app.dialogs.element('.modal-message').html("You have removed sections and they will be deleted from the list. Are you sure you want to save?");
                        app.dialogs.element('.confirm').on('vclick', function() {
                            app.dialogs.hide(callback);
                        });
                    } else {
                        callback();
                    }
                },
                function(callback) {
                    app.dialogs.show().element('.message-title').text('Saving');
                    app.api.updateVocabList(self.table.list, function() {
                        callback();
                    }, function() {
                        callback();
                    });
                },
                function(callback) {
                    app.api.getVocabList(self.listId, null, function(list) {
                        self.table.setList(list).renderTable();
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function() {
                self.removed = false;
                app.dialogs.hide();
            });
        },
        /**
         * @method handleSectionRemoveButtonClicked
         * @param {Event} event
         */
        handleSectionRemoveButtonClicked: function(event) {
            event.stopPropagation();
            this.removed = true;
            this.table.removeById(event.currentTarget.parentNode.id.replace('section-', ''));
            this.table.renderTable();
        },
        /**
         * @method handleTableRowClicked
         * @param {Event} event
         */
        handleTableRowClicked: function(event) {
            event.preventDefault();
            app.router.navigate('list/' + this.list.id + '/' + event.currentTarget.id.replace('section-', ''), {trigger: true});
        },
        /**
         * @method loadList
         */
        loadList: function() {
            var self = this;
            app.dialogs.show().element('.message-title').text('Loading');
            app.dialogs.element('.message-text').empty();
            app.api.getVocabList(this.listId, null, function(list) {
                self.list = list;
                console.log('LIST', list);
                self.$('#list-name').text(list.name);
                self.$('#list-description').text(list.description);
                self.$('#list-studying').text(list.peopleStudying);
                if (self.list.creator === app.user.id) {
                    self.$('#button-add-section').show();
                    self.table.readonly = false;
                } else {
                    self.$('#button-add-section').hide();
                    self.table.readonly = true;
                }
                self.table.setFields({
                    name: 'Name',
                    rows: 'Items',
                    remove: ''
                }).setList(list).renderTable();
                self.renderElements().resize();
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method resize
         * @returns {PageList}
         */
        resize: function() {
            this.$('#list').css({
                height: this.getHeight() - 80,
                'overflow-y': 'auto'
            });
            return this;
        },
        /**
         * @method sort
         * @param {String} listId
         * @returns {PageList}
         */
        set: function(listId) {
            this.listId = listId;
            this.loadList();
            return this;
        }
    });

    return PageList;
});
