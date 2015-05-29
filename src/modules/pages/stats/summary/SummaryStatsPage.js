/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/stats/summary/summary-stats-template.html',
    'core/modules/GelatoPage'
], function(
    Template, 
    GelatoPage
) {

    /**
     * @class SummaryStatsPage
     * @extends GelatoPage
     */
    var SummaryStatsPage = GelatoPage.extend({
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
         * @returns {SummaryStatsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return SummaryStatsPage;

});