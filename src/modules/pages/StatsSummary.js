/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/stats-summary.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageStatsSummary
     * @extends GelatoPage
     */
    var PageStatsSummary = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Stats Summary - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageStatsSummary}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageStatsSummary;

});