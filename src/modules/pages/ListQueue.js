/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-queue.html',
    'core/modules/GelatoPage',
    'modules/components/ListTable'
], function(Template, GelatoPage, ListTable) {

    /**
     * @class PageListQueue
     * @extends GelatoPage
     */
    var PageListQueue = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.addingTable = new ListTable();
            this.reviewingTable = new ListTable();
            this.listenTo(app.user.data.vocablists, 'add change', this.renderTables);
        },
        /**
         * @property title
         * @type String
         */
        title: 'List Queue - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageListQueue}
         */
        render: function() {
            this.renderTemplate(Template);
            this.addingTable.setElement('#adding-words-table').render();
            this.reviewingTable.setElement('#reviewing-words-table').render();
            this.renderTables();
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageListQueue}
         */
        renderTables: function() {
            var addingLists = app.user.data.vocablists.getAdding();
            var reviewingLists = app.user.data.vocablists.getReviewing();
            this.addingTable.set(addingLists, {
                name: 'Name',
                study: '',
                stopAdding: '',
                progress: 'Progress',
                status: 'Status'
            });
            this.reviewingTable.set(reviewingLists, {
                name: 'Name',
                study: '',
                startAdding: '',
                progress: 'Progress',
                status: 'Status'
            });
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {}
    });

    return PageListQueue;

});