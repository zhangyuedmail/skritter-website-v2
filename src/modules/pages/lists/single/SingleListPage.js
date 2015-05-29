/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/lists/single/single-list-template.html',
    'core/modules/GelatoPage',
    'modules/components/tables/list-sections/ListSectionsTableComponent'
], function(
    Template,
    GelatoPage,
    ListSectionsTableComponent
) {

    /**
     * @class SingleListPage
     * @extends GelatoPage
     */
    var SingleListPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.list = null;
            this.sectionTable = new ListSectionsTableComponent();
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
         * @returns {SingleListPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.$('gelato-content').hide();
            this.sectionTable.setElement(this.$('#list-sections-table')).render();
            return this;
        },
        /**
         * @method renderFields
         * @returns {SingleListPage}
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
         * @returns {SingleListPage}
         */
        renderSections: function() {
            this.sectionTable.set(this.list, {
                name: 'Name',
                wordCount: 'Word Count'
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
         * @return {SingleListPage}
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

    return SingleListPage;

});