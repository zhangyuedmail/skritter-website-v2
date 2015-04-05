/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-section.html',
    'core/modules/GelatoPage',
    'modules/components/TableViewer'
], function(Template, GelatoPage, TableViewer) {

    /**
     * @class PageListSection
     * @extends GelatoPage
     */
    var PageListSection = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.list = null;
            this.section = null;
            this.tableRows = new TableViewer();
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.lists.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageListSection}
         */
        render: function() {
            this.renderTemplate(Template);
            this.tableRows.setElement(this.$('.rows-table-container')).render();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageListSection}
         */
        renderFields: function() {
            this.$('.button-back').attr('data-url', 'lists/browse/' + this.list.id);
            this.$('.section-name').text(this.section.name);
            this.$('.vocablist-name').text(this.list.name);
            this.renderEvents();
            this.renderTable();
            return this;
        },
        /**
         * @method renderTable
         * @returns {PageListSection}
         */
        renderTable: function() {
            this.tableRows.set(this.section.rows, {
                checkbox: {title: '', type: 'checkbox'},
                vocabId: {title: '', type: 'row'},
                tradVocabId: {title: '', type: 'row'}
            }, {showHeaders: false});
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method load
         * @param {String} listId
         * @param {String} sectionId
         * @return {PageListSection}
         */
        load: function(listId, sectionId) {
            var self = this;
            app.api.fetchVocabList(listId, null, function(result) {
                self.list = result || [];
                self.section = _.find(self.list.sections, {id: sectionId});
                self.renderFields();
            }, function(error) {
                console.log(error);
            });
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            return this;
        }
    });

    return PageListSection;

});