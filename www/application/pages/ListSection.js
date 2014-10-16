/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/list-section.html',
    'components/ListRowTable'
], function(BasePage, TemplateMobile, ListRowTable) {
    /**
     * @class PageListSection
     * @extends BasePage
     */
    var PageListSection = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'List';
            this.list = undefined;
            this.listId = undefined;
            this.section = undefined;
            this.sectionId = undefined;
            this.table = new ListRowTable();
        },
        /**
         * @method render
         * @returns {PageListSection}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.table.setElement(this.$('.row-table-container')).render();
            this.resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageListSection}
         */
        renderElements: function() {
            if (this.list.creator === app.user.id) {
                this.$('#button-add-section').show();
                this.table.readonly = false;
            } else {
                this.$('#button-add-section').hide();
                this.table.readonly = true;
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick table tr': 'handleTableRowClicked',
            'vclick #button-back': 'handleBackButtonClicked',
            'vclick #button-save': 'handleSaveButtonClicked',
            'vclick .row-field-remove': 'handleRowRemoveButtonClicked'
        }),
        /**
         * @method handleBackButtonClicked
         * @param {Event} event
         */
        handleBackButtonClicked: function(event) {
            event.preventDefault();
            app.router.navigate('list/' + this.list.id, {trigger: true});
        },
        /**
         * @method handleRowRemoveButtonClicked
         * @param {Event} event
         */
        handleRowRemoveButtonClicked: function(event) {
            event.stopPropagation();
            this.table.removeById(event.currentTarget.parentNode.id.replace('vocab-', ''));
            this.table.renderTable();
        },
        /**
         * @method handleSaveButtonClicked
         * @param {Event} event
         */
        handleSaveButtonClicked: function(event) {
            event.preventDefault();
            app.dialogs.show().element('.message-title').text('Saving');
            app.api.updateVocabListSection(this.list, this.table.section, function() {
                app.dialogs.hide();
            }, function() {
                app.dialogs.hide();
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
                self.list = list;
                self.section = _.find(list.sections, {id: self.sectionId});
                self.$('#list-name').text(self.list.name);
                self.$('#section-name').text(self.section.name);
                if (self.list.creator === app.user.id) {
                    self.$('#button-add-vocab').show();
                    self.table.readonly = false;
                } else {
                    self.$('#button-add-vocab').hide();
                    self.table.readonly = true;
                }
                self.table.setFields({
                    writing: 'Writing',
                    remove: ''
                }).setSection(self.section).renderTable();
                self.renderElements().resize();
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method resize
         * @returns {PageListSection}
         */
        resize: function() {
            this.$('#list-section').css({
                height: this.getHeight() - 75,
                'overflow-y': 'auto'
            });
            return this;
        },
        /**
         * @method sort
         * @param {String} listId
         * @param {String} sectionId
         * @returns {PageListSection}
         */
        set: function(listId, sectionId) {
            this.listId = listId;
            this.sectionId = sectionId;
            this.loadList();
            return this;
        }
    });

    return PageListSection;
});