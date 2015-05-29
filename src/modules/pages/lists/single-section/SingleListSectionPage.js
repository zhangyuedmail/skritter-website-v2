/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/lists/single-section/single-list-section-template.html',
    'core/modules/GelatoPage',
    'modules/components/tables/list-rows/ListRowsTableComponent'
], function(
    Template,
    GelatoPage,
    ListRowsTableComponent
) {

    /**
     * @class SingleListSectionPage
     * @extends GelatoPage
     */
    var SingleListSectionPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.list = null;
            this.rowTable = new ListRowsTableComponent();
            this.section = null;
        },
        /**
         * @property title
         * @type String
         */
        title: 'List Section - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {SingleListSectionPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.rowTable.setElement(this.$('#section-rows-table')).render();
            return this;
        },
        /**
         * @method renderFields
         * @returns {SingleListSectionPage}
         */
        renderFields: function() {
            this.$('#list-name').text(this.list.get('name'));
            this.$('#list-url').attr('data-url', 'lists/browse/' + this.list.id);
            this.$('#section-name').text(this.section.name);
            this.renderEvents();
            return this;
        },
        /**
         * @method renderRows
         * @returns {SingleListSectionPage}
         */
        renderRows: function() {
            this.rowTable.set(this.section, {
                select: '',
                vocabId: '',
                tradVocabId: '',
                reading: '',
                definition: ''
            });
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
         * @return {SingleListSectionPage}
         */
        load: function(listId, sectionId) {
            var self = this;
            Async.series([
                function(callback) {
                    app.user.data.vocablists.fetchById(listId, function(result) {
                        self.list = result[0];
                        self.section = self.list.getSectionById(sectionId);
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    var vocabIds = _.pluck(self.section.rows, 'vocabId');
                    app.user.data.vocabs.fetchById(vocabIds, function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('LIST LOAD ERROR:', error);
                } else {
                    self.renderFields();
                    self.renderRows();
                }
            });
            return this;
        }
    });

    return SingleListSectionPage;

});