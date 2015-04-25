/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/words.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageWords
     * @extends GelatoPage
     */
    var PageWords = GelatoPage.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
        },
        /**
         * @property title
         * @type String
         */
        title: 'Words - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageWords}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageWords;

});