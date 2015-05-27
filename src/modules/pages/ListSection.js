/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-section.html',
    'core/modules/GelatoPage',
    'modules/components/RowTable'
], function(Template, GelatoPage, RowTable) {

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
            this.rowTable = new RowTable();
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
         * @returns {PageListSection}
         */
        render: function() {
            this.renderTemplate(Template);
            this.rowTable.setElement(this.$('#list-rows-table')).render();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageListSection}
         */
        renderFields: function() {
            return this;
        },
        /**
         * @method renderRows
         * @returns {PageListSection}
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
         * @return {PageListSection}
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

    return PageListSection;

});