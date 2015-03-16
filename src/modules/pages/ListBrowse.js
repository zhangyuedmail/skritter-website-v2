/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-browse.html',
    'core/modules/GelatoPage',
    'modules/collections/DataVocabLists',
    'modules/components/TableViewer'
], function(Template, GelatoPage, DataVocabLists, TableViewer) {

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
            this.lists = new DataVocabLists();
            this.table = new TableViewer();
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
            this.table.setElement(this.$('.browse-container')).render();
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageListBrowse}
         */
        renderTables: function() {
            this.table.load(this.lists.models, {
                name: 'Name',
                peopleStudying: 'People',
                add: {head: "", body: "<div><i class='fa fa-plus-circle cursor'></i> Add to queue</div>"}
            }).sortBy('peopleStudying', true);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .table-viewer .field-name': 'handleClickTableFieldName'
        },
        /**
         * @method handleClickTableFieldName
         * @param {Event} event
         */
        handleClickTableFieldName: function(event) {
            event.preventDefault();
            var listId = $(event.currentTarget).parent().get(0).id.replace('row-', '');
            app.router.navigate('lists/browse/' + listId, {trigger: true});
        },
        /**
         * @method load
         * @return {PageListBrowse}
         */
        load: function() {
            var self = this;
            (function next(cursor) {
                app.api.fetchVocabLists({
                    cursor: cursor,
                    fields: 'id,name,peopleStudying',
                    sort: 'official'
                }, function(result) {
                    self.lists.add(result.VocabLists);
                    //TODO: reverse cursor flash after testing
                    if (!result.cursor) {
                        next(result.cursor);
                    } else {
                        self.renderTables();
                    }
                }, function(error) {
                    console.log(error);
                });
            })();
            return this;
        }
    });

    return PageListBrowse;

});