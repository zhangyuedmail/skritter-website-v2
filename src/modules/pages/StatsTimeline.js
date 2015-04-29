/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/stats-timeline.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageStatsTimeline
     * @extends GelatoPage
     */
    var PageStatsTimeline = GelatoPage.extend({
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
         * @returns {PageStatsTimeline}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageStatsTimeline;

});