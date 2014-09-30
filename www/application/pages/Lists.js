/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/mobile/lists.html',
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
            'vclick table tr': 'handleTableRowClicked'
        }),
        /**
         * @method handleTableRowClicked
         * @param {Event} event
         */
        handleTableRowClicked: function(event) {
            event.preventDefault();
            app.router.navigate('lists/' + event.currentTarget.id.replace('list-', ''));
        },
        /**
         * @method loadMyLists
         */
        loadMyLists: function() {
            var self = this;
            app.api.getVocabLists({
                sort: 'studying'
            }, function(lists) {
                console.log(lists);
                app.user.data.vocablists.add(lists, {merge: true});
                self.table.setLists(lists).renderTable();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method loadTextbooks
         */
        loadTextbooks: function() {
            var self = this;
            app.api.getVocabLists({
                sort: 'official'
            }, function(lists) {
                console.log(lists);
                self.table.setLists(lists).renderTable();
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
                height: this.getHeight() - 70,
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
            this.table.setFields({
                image: 'Image',
                name: 'Name'
            }).sortByName();
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
