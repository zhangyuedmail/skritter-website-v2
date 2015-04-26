/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-browse.html',
    'core/modules/GelatoPage',
    'modules/components/ListTable'
], function(Template, GelatoPage, ListTable) {

    /**
     * @class PageListBrowse
     * @extends GelatoPage
     */
    var PageListBrowse = GelatoPage.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
            this.browseTable = new ListTable({app: this.app});
            this.filter = '';
            this.sort = 'name';
            this.listenTo(this.app.user.data.vocablists, 'add change', this.renderTables);
            this.app.user.data.vocablists.fetchOfficial();
        },
        /**
         * @property title
         * @type String
         */
        title: 'Browse - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageListBrowse}
         */
        render: function() {
            this.renderTemplate(Template);
            this.browseTable.setElement('#browse-lists-table').render();
            this.renderTables();
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageListBrowse}
         */
        renderTables: function() {
            var officialLists = this.app.user.data.vocablists.getOfficial();
            this.browseTable.set(officialLists, {
                name: 'Name',
                popularity: 'Popularity',
                difficulty: 'Difficulty',
                addStatus: ''
            }).sortBy(this.sort);
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
            this.filter = $input.val();
            this.browseTable.filterBy(this.filter).sortBy(this.sort);
        }
    });

    return PageListBrowse;

});