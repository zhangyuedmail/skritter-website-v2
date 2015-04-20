/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-queue.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageListQueue
     * @extends GelatoPage
     */
    var PageListQueue = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'List Queue - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageListQueue}
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
         * @return {PageListQueue}
         */
        load: function() {
            return this;
        }
    });

    return PageListQueue;

});