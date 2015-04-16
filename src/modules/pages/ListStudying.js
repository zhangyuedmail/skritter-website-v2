/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-studying.html',
    'core/modules/GelatoPage',
    'modules/components/TableViewer'
], function(Template, GelatoPage, TableViewer) {

    /**
     * @class PageListStudying
     * @extends GelatoPage
     */
    var PageListStudying = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.lists = null;
            this.tableAdding = new TableViewer();
            this.tableReviewing = new TableViewer();
        },
        /**
         * @property title
         * @type String
         */
        title: i18n.lists.title + ' - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageListStudying}
         */
        render: function() {
            this.renderTemplate(Template);
            this.tableAdding.setElement(this.$('.adding-table-container')).render();
            this.tableReviewing.setElement(this.$('.reviewing-table-container')).render();
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageListStudying}
         */
        renderTables: function() {
            this.tableAdding.set(this.lists.getAdding(), {
                name: {title: '', type: 'row'},
                progress: {title: '', type: 'progress'},
                studyList: {title: '', type: 'text', value: 'Study list'},
                stopAdding: {title: '', type: 'text', value: 'Stop adding'},
                settings: {title: '', type: 'text', value: "<i class='fa fa-cog'></i>"},
                remove: {title: '', type: 'text', value: "<i class='fa fa-close'></i>"}
            }, {showHeaders: false});
            this.tableReviewing.set(this.lists.getReviewing(), {
                name: {title:'', type: 'row'},
                progress: {title: '', type: 'progress'},
                studyList: {title: '', type: 'text', value: 'Study list'},
                restartAdding: {title: '', type: 'text', value: 'Restart list'},
                settings: {title: '', type: 'text', value: "<i class='fa fa-cog'></i>"},
                remove: {title: '', type: 'text', value: "<i class='fa fa-close'></i>"}
            }, {showHeaders: false});
            this.resize();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .table .field-name': 'handleClickTableRow',
            'vclick .table .field-remove': 'handleClickTableRemove',
            'vclick .table .field-restartadding': 'handleClickTableRestartAdding',
            'vclick .table .field-stopadding': 'handleClickTableStopAdding'
        },
        /**
         * @method handleClickTableRemove
         * @param {Event} event
         */
        handleClickTableRemove: function(event) {
            event.preventDefault();
            var listId = $(event.currentTarget).parent().get(0).id.replace('row-', '');
            var list = this.lists.get(listId);
            list.set('studyingMode', 'not studying');
        },
        /**
         * @method handleClickTableRestartAdding
         * @param {Event} event
         */
        handleClickTableRestartAdding: function(event) {
            event.preventDefault();
            var listId = $(event.currentTarget).parent().get(0).id.replace('row-', '');
            var list = this.lists.get(listId);
            list.set('studyingMode', 'adding');
        },
        /**
         * @method handleClickTableStopAdding
         * @param {Event} event
         */
        handleClickTableStopAdding: function(event) {
            event.preventDefault();
            var listId = $(event.currentTarget).parent().get(0).id.replace('row-', '');
            var list = this.lists.get(listId);
            list.set('studyingMode', 'reviewing');
        },
        /**
         * @method handleClickTableRow
         * @param {Event} event
         */
        handleClickTableRow: function(event) {
            event.preventDefault();
            var listId = $(event.currentTarget).parent().attr('id').replace('row-', '');
            app.router.navigate('lists/browse/' + listId, {trigger: true});
        },
        /**
         * @method load
         * @return {PageListStudying}
         */
        load: function() {
            var self = this;
            app.user.data.vocablists.fetch(function(result) {
                self.lists = result;
                self.listenTo(result, 'change', self.renderTables);
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

    return PageListStudying;

});