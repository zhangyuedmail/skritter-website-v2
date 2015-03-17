/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list.html',
    'core/modules/GelatoPage',
    'modules/components/TableViewer',
    'modules/models/DataVocabList'
], function(Template, GelatoPage, TableViewer, DataVocabList) {

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
            this.list = new DataVocabList();
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
            this.table.setElement(this.$('.sections-container')).render();
            this.table.hideSearchBar();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageListBrowse}
         */
        renderFields: function() {
            this.$('.content-header').text(app.fn.pinyin.removeTones(this.list.get('name')));
            this.$('.list-description').html(app.fn.pinyin.removeTones(this.list.get('description')));
            this.$('.list-studied-count').text(this.list.get('peopleStudying'));
            this.$('.list-word-count').text(this.list.getWordCount());
            if (this.list.get('sort') === 'official') {
                this.$('.list-author').text('Skritter');
                this.$('.list-published').text('Official');
            } else {
                this.$('.list-author').text(this.list.get('creator'));
                this.$('.list-published').text(app.fn.formatDate(this.list.get('published')));
            }
            return this;
        },
        /**
         * @method renderSections
         * @returns {PageListBrowse}
         */
        renderSections: function() {
            this.table.load(this.list.get('sections'), {
                name: 'Name',
                sectionWordCount: '',
                sectionStatus: ''
            });
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
            var sectionId = $(event.currentTarget).parent().get(0).id;
            console.log(sectionId);
        },
        /**
         * @method load
         * @param {String} listId
         * @return {PageListBrowse}
         */
        load: function(listId) {
            var self = this;
            app.api.fetchVocabList(listId, null, function(list) {
                self.list.set(list);
                self.renderFields();
                self.renderSections();
            }, function(error) {
                console.log(error);
            });
            return this;
        }
    });

    return PageListBrowse;

});