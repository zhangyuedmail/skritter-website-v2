/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/lists/custom/custom-lists-template.html',
    'core/modules/GelatoPage',
    'modules/components/tables/lists/ListsTableComponent'
], function(
    Template,
    GelatoPage,
    ListsTableComponent
) {

    /**
     * @class CustomListsPage
     * @extends GelatoPage
     */
    var CustomListsPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.customTable = new ListsTableComponent();
            this.listenTo(app.user.data.vocablists, 'add change', this.renderTables);

        },
        /**
         * @property title
         * @type String
         */
        title: 'My Lists - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {CustomListsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.customTable.setElement('#custom-lists-table').render();
            this.renderTables();
            return this;
        },
        /**
         * @method renderTables
         * @returns {CustomListsPage}
         */
        renderTables: function() {
            var customLists = app.user.data.vocablists.getCustom();
            this.customTable.set(customLists, {
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
            this.customTable.filterBy($input.val()).sortBy('name');
        },
        /**
         * @method load
         * @returns {CustomListsPage}
         */
        load: function() {
            app.user.data.vocablists.fetchCustom();
            return this;
        }
    });

    return CustomListsPage;

});