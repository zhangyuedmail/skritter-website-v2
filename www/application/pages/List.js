/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/mobile/list.html',
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
            this.listName = undefined;
            this.table = new ListSectionTable();
        },
        /**
         * @method render
         * @returns {PageList}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.table.setElement(this.$('.section-table-container')).render();
            this.resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageList}
         */
        renderElements: function() {
            switch (this.list.studyingMode) {
                case 'adding':
                    this.$('#button-add').hide();
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
            'vclick #button-add': 'handleButtonAddClicked'
        }),
        /**
         * @method handleTableRowClicked
         * @param {Event} event
         */
        handleButtonAddClicked: function(event) {
            event.preventDefault();
            app.dialogs.show().element('.message-title').text('Updating');
            app.dialogs.element('.message-text').text('ADDING LIST');
            app.api.updateVocabList({
                id: this.listId,
                studyingMode: 'adding'
            }, function(result) {
                console.log(result);
                app.user.data.vocablists.add(result, {merge: true});
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method handleTableRowClicked
         * @param {Event} event
         */
        handleTableRowClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method loadList
         */
        loadList: function() {
            var self = this;
            app.dialogs.show().element('.message-title').text('Loading');
            app.dialogs.element('.message-text').text('SELECTED LIST');
            app.api.getVocabList(this.listId, null, function(list) {
                console.log(list);
                self.list = list;
                self.$('#list-name').text(list.name);
                self.$('#list-description').text(list.description);
                self.$('#list-studying').text(list.peopleStudying);
                self.table.setFields({
                    name: 'Name',
                    rows: 'Items'
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
            var detailHeight = this.$('#detail').height();
            this.$('#sections').css({
                height: this.getHeight() - detailHeight - 100,
                'overflow-y': 'auto'
            });
            return this;
        },
        /**
         * @method sort
         * @param {String} listId
         * @param {String} [listName]
         * @returns {PageList}
         */
        set: function(listId, listName) {
            this.listId = listId;
            this.listName = listName;
            this.loadList();
            return this;
        }
    });

    return PageList;
});
