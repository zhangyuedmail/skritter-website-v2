/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/about.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageAbout
     * @extends GelatoPage
     */
    var PageAbout = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'About - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageAbout}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageAbout;

});