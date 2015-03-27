/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-studying.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageListStudying
     * @extends GelatoPage
     */
    var PageListStudying = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.lists = null;
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.lists.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageListStudying}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageListStudying}
         */
        renderTables: function() {
            return this;
        },
        /**
         * @method load
         * @return {PageListStudying}
         */
        load: function() {
            return this;
        }
    });

    return PageListStudying;

});