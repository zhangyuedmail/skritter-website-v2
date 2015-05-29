/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/lists/queue/queue-lists-template.html',
    'core/modules/GelatoPage',
    'modules/components/ListTable'
], function(
    Template,
    GelatoPage,
    ListTable
) {

    /**
     * @class QueueListsPage
     * @extends GelatoPage
     */
    var QueueListsPage = GelatoPage.extend({
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
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {QueueListsPage}
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
         * @returns {QueueListsPage}
         */
        renderTables: function() {
            var addingLists = app.user.data.vocablists.getAdding();
            var reviewingLists = app.user.data.vocablists.getReviewing();
            if (addingLists.length) {
                this.$('#header-adding').show();
                this.addingTable.set(addingLists, {
                    name: 'Name',
                    progress: 'Progress',
                    study: '',
                    stopAdding: '',
                    remove: ''
                });
            } else {
                this.$('#header-adding').hide();
            }
            if (reviewingLists.length) {
                this.$('#header-reviewing').show();
                this.reviewingTable.set(reviewingLists, {
                    name: 'Name',
                    progress: 'Progress',
                    study: '',
                    startAdding: '',
                    remove: ''
                });
            } else {
                this.$('#header-reviewing').hide();
            }
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method load
         * @returns {QueueListsPage}
         */
        load: function() {
            app.user.data.vocablists.fetch();
            return this;
        }
    });

    return QueueListsPage;

});