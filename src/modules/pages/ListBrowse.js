/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-browse.html',
    'core/modules/GelatoPage',
    'modules/components/TableViewer'
], function(Template, GelatoPage, TableViewer) {

    /**
     * @class PageListBrowse
     * @extends GelatoPage
     */
    var PageListBrowse = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.lists = [];
            this.tableLists = new TableViewer();
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.lists.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageListBrowse}
         */
        render: function() {
            this.renderTemplate(Template);
            this.tableLists.setElement(this.$('.lists-table-container')).render();
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageListBrowse}
         */
        renderTables: function() {
            this.tableLists.set(this.lists, {
                name: {title: 'Name', type: 'text'},
                popularity: {title: 'Popularity', type: 'progress'},
                difficulty: {title: 'Difficulty', type: 'text'},
                addToQueue: {title: '', type: 'link', linkText: "<i class='fa fa-plus-circle'></i> Add to queue"}
            }, {showHeaders: true}).sortBy('name');
            this.resize();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'keyup .list-search-input': 'handleKeyupListSearchInput',
            'vclick .lists-table-container .field-name': 'handleClickListTableRow'
        },
        /**
         * @method handleClickListTableRow
         * @param {Event} event
         */
        handleClickListTableRow: function(event) {
            event.preventDefault();
            var listId = $(event.currentTarget).parent().attr('id').replace('row-', '');
            app.router.navigate('lists/browse/' + listId, {trigger: true});
        },
        /**
         * @method handleKeyupListSearchInput
         * @param {Event} event
         */
        handleKeyupListSearchInput: function(event) {
            event.preventDefault();
            var searchValue = $(event.currentTarget).find('input').val();
            this.tableLists.filterBy('name', searchValue);
        },
        /**
         * @method load
         * @return {PageListBrowse}
         */
        load: function() {
            var self = this;
            app.api.fetchVocabLists({sort: 'official'}, function(result) {
                self.lists = result.VocabLists || [];
                self.renderTables();
            }, function(error) {
                console.log(error);
            });
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            var contentBlock = this.$('.content-block');
            var menuColumn = this.$('.menu-column');
            menuColumn.height(contentBlock.height());
            return this;
        }
    });

    return PageListBrowse;

});