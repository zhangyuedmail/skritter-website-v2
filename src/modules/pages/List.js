/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageList
     * @extends GelatoPage
     */
    var PageList = GelatoPage.extend({
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
         * @returns {PageList}
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
         * @return {PageList}
         */
        load: function(listId) {
            return this;
        }
    });

    return PageList;

});