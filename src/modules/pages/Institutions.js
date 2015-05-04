/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/institutions.html',
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
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Institutions - ' + i18n.global.title,
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