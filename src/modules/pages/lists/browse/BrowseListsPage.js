/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/lists/browse/browse-lists-template.html',
    'core/modules/GelatoPage',
    'modules/components/tables/lists/ListsTableComponent'
], function(
    Template,
    GelatoPage,
    ListsTableComponent
) {

    /**
     * @class BrowseListsPage
     * @extends GelatoPage
     */
    var BrowseListsPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.browseTable = new ListsTableComponent();
            this.listenTo(app.user.data.vocablists, 'add change', this.renderTables);

        },
        /**
         * @property title
         * @type String
         */
        title: 'Browse - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {BrowseListsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.browseTable.setElement('#browse-lists-table').render();
            this.renderTables();
            return this;
        },
        /**
         * @method renderTables
         * @returns {BrowseListsPage}
         */
        renderTables: function() {
            var officialLists = app.user.data.vocablists.getOfficial();
            this.browseTable.set(officialLists, {
                name: 'Name',
                addStatus: ''
            }).sortBy('name');
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'keyup #list-search-input': 'handleKeypressListSearch'
        },
        /**
         * @method handleKeypressListSearch
         * @param {Event} event
         */
        handleKeypressListSearch: function(event) {
            event.preventDefault();
            var $input = $(event.currentTarget);
            this.browseTable.filterBy($input.val()).sortBy('name');
        },
        /**
         * @method load
         * @returns {BrowseListsPage}
         */
        load: function() {
            app.user.data.vocablists.fetchOfficial();
            return this;
        }
    });

    return BrowseListsPage;

});