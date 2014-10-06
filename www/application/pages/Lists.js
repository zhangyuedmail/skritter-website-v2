/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/lists.html',
    'components/ListTable'
], function(BasePage, TemplateMobile, ListTable) {
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
            this.table = new ListTable();
        },
        /**
         * @method render
         * @returns {PageLists}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.table.setElement(this.$('.list-table-container')).render();
            this.resize();
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
        events: _.extend({}, BasePage.prototype.events, {
            'vclick table tr': 'handleTableRowClicked',
            'keyup #search-box': 'handleSearchBoxChanged'
        }),
        /**
         * @method handleSearchBoxChanged
         * @param {Event} event
         */
        handleSearchBoxChanged: function(event) {
            event.preventDefault();
            var searchText = this.$('#search-box').val();
            this.table.filterBy({
                categories: searchText,
                name: searchText,
                shortName: searchText
            }).renderTable();
        },
        /**
         * @method handleTableRowClicked
         * @param {Event} event
         */
        handleTableRowClicked: function(event) {
            event.preventDefault();
            app.router.navigate('list/' + event.currentTarget.id.replace('list-', ''), {trigger: true});
        },
        /**
         * @method loadMyLists
         */
        loadMyLists: function() {
            var self = this;
            app.dialogs.show().element('.message-title').text('Loading');
            app.dialogs.element('.message-text').text('MY LISTS');
            app.api.getVocabLists({
                lang: app.user.getLanguageCode(),
                sort: 'studying'
            }, function(lists) {
                app.user.data.vocablists.add(lists, {merge: true});
                self.table.setFields({
                    image: '',
                    name: 'Name',
                    studyingMode: 'Status'
                }).setLists(lists).sortByStatus().renderTable();
                self.$('#button-my-lists').addClass('active');
                self.$('#button-textbooks').removeClass('active');
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method loadTextbooks
         */
        loadTextbooks: function() {
            var self = this;
            app.dialogs.show().element('.message-title').text('Loading');
            app.dialogs.element('.message-text').text('TEXTBOOKS');
            app.api.getVocabLists({
                lang: app.user.getLanguageCode(),
                sort: 'official'
            }, function(lists) {
                self.table.setFields({
                    image: '',
                    name: 'Name'
                }).setLists(lists).sortByName().renderTable();
                self.$('#button-my-lists').removeClass('active');
                self.$('#button-textbooks').addClass('active');
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method resize
         * @returns {PageLists}
         */
        resize: function() {
            this.$('#lists').css({
                height: this.getHeight() - 120,
                'overflow-y': 'auto'
            });
            return this;
        },
        /**
         * @method sort
         * @param {String} sort
         * @returns {PageLists}
         */
        set: function(sort) {
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
