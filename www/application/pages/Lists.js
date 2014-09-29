/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/mobile/lists.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageLists
     * @extends BasePage
     */
    var PageLists = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Lists';
            this.listTable = app.user.data.vocablists.getTable();
        },
        /**
         * @method render
         * @returns {PageLists}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            app.sidebars.enable();
            this.elements.listContainer = this.$('.list-container');
            this.elements.listViewer = this.$('#list-viewer');
            this.listTable.setElement(this.elements.listContainer).render().setFields({
                name: 'Title',
                studyingMode: 'Status'
            });
            this.renderElements().resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageLists}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {}),
        /**
         * @method loadMyLists
         */
        loadMyLists: function() {
            this.listTable.filterActive();
        },
        /**
         * @method loadTextbooks
         */
        loadTextbooks: function() {
            var self = this;
            app.api.getVocabLists({
                sort: 'official'
            }, function(lists) {
                self.listTable.lists = lists;
                self.listTable.renderTable();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method resize
         * @returns {PageLists}
         */
        resize: function() {
            var contentHeight = this.getHeight();
            this.elements.listViewer.css({
                'max-height': contentHeight - 75,
                'overflow-y': 'auto'
            });
            return this;
        },
        /**
         * @method sort
         * @param {String} sort
         * @returns {PageLists}
         */
        sort: function(sort) {
            if (sort === 'textbooks') {
                this.loadTextbooks();
            } else {
                this.loadMyLists();
            }
            return this;
        }
    });

    return PageLists;
});
