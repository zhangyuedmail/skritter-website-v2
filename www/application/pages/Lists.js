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
            this.lists= [];
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
         * @method loadAll
         */
        loadAll: function() {
            var self = this;
            app.dialogs.show().element('.message-title').text('Loading');
            app.dialogs.element('.message-text').empty();
            app.api.getVocabLists({
                lang: app.user.getLanguageCode(),
                sort: 'official'
            }, function(lists) {
                self.table.setFields({
                    image: '',
                    name: 'Name'
                }).setLists(lists).sortByName().renderTable();
                self.$('.sort-button').removeClass('active');
                self.$('#button-textbooks').addClass('active');
                self.setTitle('Browse Lists');
                app.dialogs.hide();
            }, function(error) {
                //TODO: add in handling for offline
            });
        },
        /**
         * @method loadMyLists
         */
        loadMyLists: function() {
            var self = this;
            app.dialogs.show().element('.message-title').text('Loading');
            app.dialogs.element('.message-text').empty();
            async.waterfall([
                function(callback) {
                    app.api.getVocabLists({
                        lang: app.user.getLanguageCode(),
                        sort: 'custom'
                    }, function(result) {
                        app.user.data.vocablists.add(result, {merge: true});
                        callback(null, result);
                    }, callback);
                },
                function(lists, callback) {
                    app.api.getVocabLists({
                        lang: app.user.getLanguageCode(),
                        sort: 'studying'
                    }, function(result) {
                        app.user.data.vocablists.add(result, {merge: true});
                        callback();
                    }, callback);
                }
            ], function(error) {
                if (error) {
                    //TODO: add in handling for offline
                } else {
                    self.lists = app.user.data.vocablists.toJSON();
                    self.table.setFields({
                        image: '',
                        name: 'Name',
                        studyingMode: 'Status'
                    }).setLists(self.lists).sortByStatus().renderTable();
                    self.$('.sort-button').removeClass('active');
                    self.$('#button-my-lists').addClass('active');
                }
                self.setTitle('My Lists');
                app.dialogs.hide();
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
            if (sort === 'browse') {
                this.loadAll();
            } else {
                this.loadMyLists();
            }
            return this;
        }
    });

    return PageLists;
});
