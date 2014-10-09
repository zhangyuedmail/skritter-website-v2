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
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick table tr': 'handleTableRowClicked',
            'vclick #button-back': 'handleBackButtonClicked'
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
                self.table.setFields({
                    writing: 'Writing',
                    remove: ''
                }).setRows(self.section.rows).renderTable();
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
