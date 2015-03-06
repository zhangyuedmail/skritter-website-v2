/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/lists.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageLists
     * @extends GelatoPage
     */
    var PageLists = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: app.strings.lists.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageLists}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageLists;

});