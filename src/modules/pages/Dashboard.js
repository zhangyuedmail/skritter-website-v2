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
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
            this.listenTo(this.app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(this.app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(this.app.user.data.stats, 'add change', this.renderStats);
        },
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
            this.renderStats();
            return this;
        },
        /**
         * @method renderStats
         * @returns {PageDashboard}
         */
        renderStats: function() {
            this.$('#characters-learned-value').text(this.app.user.data.stats.getTotalCharactersLearned());
            this.$('#items-added-value').text(this.app.user.data.items.getAddedCount());
            this.$('#items-reviewed-value').text(this.app.user.data.items.getReviewedCount());
            this.$('#words-learned-value').text(this.app.user.data.stats.getTotalWordsLearned());
            return this;
        }
    });

    return PageDashboard;

});