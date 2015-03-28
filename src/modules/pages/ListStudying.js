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
            this.lists = [];
            this.tableAdding = new TableViewer();
            this.tableReviewing = new TableViewer();
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.lists.title + ' - ' + app.strings.global.title,
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
            this.tableAdding.set(this.getAdding(), {
                name: {title: '', type: 'text'},
                progress: {title: '', type: 'progress'},
                linkStudyList: {title: '', type: 'link', linkText: 'Study list'},
                linkStopAdding: {title: '', type: 'link', linkText: 'Stop adding'},
                linkSettings: {title: '', type: 'link', linkText: "<i class='fa fa-cog'></i>"},
                linkRemove: {title: '', type: 'link', linkText: "<i class='fa fa-close'></i>"}
            }, {showHeaders: false});
            this.tableReviewing.set(this.getReviewing(), {
                name: {title:'', type: 'text'},
                progress: {title: '', type: 'progress'},
                linkStudyList: {title: '', type: 'link', linkText: 'Study list'},
                linkRestartAdding: {title: '', type: 'link', linkText: 'Restart list'},
                linkSettings: {title: '', type: 'link', linkText: "<i class='fa fa-cog'></i>"},
                linkRemove: {title: '', type: 'link', linkText: "<i class='fa fa-close'></i>"}
            }, {showHeaders: false});
            this.resize();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .table .field-name': 'handleClickTableRow'
        },
        /**
         * @method handleClickTableRow
         * @param {Event} event
         */
        handleClickTableRow: function(event) {
            event.preventDefault();
            console.log(event);
            var listId = $(event.currentTarget).parent().attr('id').replace('row-', '');
            app.router.navigate('lists/browse/' + listId, {trigger: true});
        },
        /**
         * @method getAdding
         * @returns {Array}
         */
        getAdding: function() {
            return this.lists.filter(function(list) {
                return list['studyingMode'] === 'adding';
            });
        },
        /**
         * @method getReviewing
         * @returns {Array}
         */
        getReviewing: function() {
            return this.lists.filter(function(list) {
                return list['studyingMode'] === 'reviewing';
            });
        },
        /**
         * @method load
         * @return {PageListStudying}
         */
        load: function() {
            var self = this;
            app.api.fetchVocabLists({sort: 'studying'}, function(result) {
                self.lists = result['VocabLists'] || [];
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