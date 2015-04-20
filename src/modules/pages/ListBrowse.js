/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-browse.html',
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
        title: 'Browse - ' + i18n.global.title,
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
         * @return {PageListBrowse}
         */
        load: function() {
            return this;
        }
    });

    return PageListBrowse;

});