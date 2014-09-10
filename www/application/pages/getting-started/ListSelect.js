/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/getting-started/list-select.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageListSelect
     * @extends BasePage
     */
    var PageListSelect = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.onboarding.title;
            this.lists = [];
            this.listsFiltered = undefined;
        },
        /**
         * @method render
         * @returns {PageListSelect}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            this.elements.listTable = this.$('#list-table');
            this.elements.loadingBox = this.$('.loading-box');
            this.elements.searchBox = this.$('#search-box');
            this.loadLists();
            return this;
        },
        /**
         * @method renderListTable
         * @returns {PageListSelect}
         */
        renderListTable: function() {
            var divBody = '';
            var lists = this.getLists();
            for (var i = 0, length = lists.length; i < length; i++) {
                var list = lists[i];
                divBody += "<tr id='list-" + list.id + "' class='list'>";
                divBody += "<td>" + list.name + "</td>";
                divBody += "</tr>";

            }
            this.elements.listTable.find('tbody').html(divBody);
            this.elements.loadingBox.hide();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick .list': 'handleListClicked',
            'vclick .recommended-list': 'handleRecommendedClicked',
            'keyup #search-box': 'handleSearchBoxChanged'
        }),
        /**
         * @method filterLists
         * @param {Object} criteria
         * @returns {PageListSelect}
         */
        filterLists: function(criteria) {
            this.listsFiltered = _.filter(this.lists, function(list) {
                for (var criterion in criteria) {
                    if (list[criterion].toLowerCase().indexOf(criteria[criterion].toLowerCase()) === -1) {
                        return false;
                    }
                }
                return true;
            });
            return this;
        },
        /**
         * @method getLists
         * @returns {Array}
         */
        getLists: function() {
            if (this.listsFiltered) {
                return this.listsFiltered;
            }
            return this.lists;
        },
        /**
         * @method handleListClicked
         */
        handleListClicked: function(event) {
            event.preventDefault();
            console.log(_.find(this.lists, {id: event.currentTarget.id.replace('list-', '')}));
        },
        /**
         * @method handleRecommendedClicked
         */
        handleRecommendedClicked: function(event) {
            event.preventDefault();
            this.elements.searchBox.val($(event.currentTarget).data('search'));
        },
        /**
         * @method handleSearchBoxChanged
         */
        handleSearchBoxChanged: function(event) {
            event.preventDefault();
            var searchText = this.elements.searchBox.val();
            this.filterLists({
                name: searchText,
                shortName: searchText
            });
            this.renderListTable();
        },
        /**
         * @method loadLists
         * @returns {PageListSelect}
         */
        loadLists: function() {
            var self = this;
            app.api.getVocabLists({
                sort: 'official'
            }, function(lists) {
                self.lists = lists;
                self.sortLists();
                self.renderListTable();
            }, function(error) {
                console.error(error);
            });
            return this;
        },
        /**
         * @method sortLists
         * @returns {PageListSelect}
         */
        sortLists: function() {
            this.lists = _.sortBy(this.lists, function(list) {
                return list.name;
            });
            return this;
        }
    });

    return PageListSelect;
});
