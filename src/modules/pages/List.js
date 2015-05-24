/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list.html',
    'core/modules/GelatoPage',
    'modules/components/SectionTable'
], function(Template, GelatoPage, SectionTable) {

    /**
     * @class PageList
     * @extends GelatoPage
     */
    var PageList = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.list = null;
            this.sectionTable = new SectionTable();
        },
        /**
         * @property title
         * @type String
         */
        title: 'List - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {PageList}
         */
        render: function() {
            this.renderTemplate(Template);
            this.$('gelato-content').hide();
            this.sectionTable.setElement(this.$('#list-sections-table')).render();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageList}
         */
        renderFields: function() {
            this.$('#list-description').text(this.list.get('description'));
            this.$('#list-name').text(this.list.get('name'));
            this.$('#list-tags').text(this.list.get('tags').join(', '));
            this.$('gelato-content').show();
            return this;
        },
        /**
         * @method renderSections
         * @returns {PageList}
         */
        renderSections: function() {
            this.sectionTable.set(this.list, {
                name: 'Name',
                wordCount: 'Word Count',
                status: 'Status'
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
         * @return {PageList}
         */
        load: function(listId) {
            var self = this;
            app.user.data.vocablists.fetchById(listId, function(result) {
                self.list = result[0];
                self.renderFields();
                self.renderSections();
            }, function(error) {
                console.error('LIST LOAD ERROR:', error);
            });
            return this;
        }
    });

    return PageList;

});