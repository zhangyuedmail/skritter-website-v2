/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/stats/timeline/timeline-stats-template.html',
    'core/modules/GelatoPage'
], function(
    Template, 
    GelatoPage
) {

    /**
     * @class TimelineStatsPage
     * @extends GelatoPage
     */
    var TimelineStatsPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'Stats Timeline - ' + i18n.global.title,
        /**
         * @method render
         * @returns {TimelineStatsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return TimelineStatsPage;

});