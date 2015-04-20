/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/dashboard.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageDashboard
     * @extends GelatoPage
     */
    var PageDashboard = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'Dashboard - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageDashboard;

});