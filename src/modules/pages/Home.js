/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/home.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageHome
     * @extends GelatoPage
     */
    var PageHome = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'Home - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageHome}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageHome;

});