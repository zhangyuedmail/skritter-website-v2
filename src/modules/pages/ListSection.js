/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-section.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageListSection
     * @extends GelatoPage
     */
    var PageListSection = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'List Section - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageListSection}
         */
        render: function() {
            this.renderTemplate(Template);
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
            return this;
        }
    });

    return PageListSection;

});