/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/stats.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageStats
     * @extends GelatoPage
     */
    var PageStats = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: app.strings.stats.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageStats}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageStats;

});