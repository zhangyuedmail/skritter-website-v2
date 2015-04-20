/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/scratchpad.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageScratchpad
     * @extends GelatoPage
     */
    var PageScratchpad = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'Scratchpad - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageScratchpad}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method load
         * @param {String} writing
         * @returns {PageScratchpad}
         */
        load: function(writing) {
            return this;
        }
    });

    return PageScratchpad;

});