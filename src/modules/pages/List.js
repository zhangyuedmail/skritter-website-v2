/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageListBrowse
     * @extends GelatoPage
     */
    var PageListBrowse = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'List - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageListBrowse}
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
         * @return {PageListBrowse}
         */
        load: function(listId) {
            return this;
        }
    });

    return PageListBrowse;

});