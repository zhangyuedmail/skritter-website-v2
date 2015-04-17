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
        initialize: function() {
            this.donutItemsLearned = null;
        },
        /**
         * @property title
         * @type String
         */
        title: i18n.stats.title + ' - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageStats}
         */
        render: function() {
            this.renderTemplate(Template);
            this.renderDonuts();
            return this;
        },
        /**
         * @method renderDonuts
         * @returns {PageStats}
         */
        renderDonuts: function() {
            var donutItemsLearned = this.$('.items-learned-donut-container').get(0).getContext('2d');
            this.donutItemsLearned = new Chart(donutItemsLearned).Doughnut([
                {value: 60, color:'#c5da4b'},
                {value: 40, color:'#efeef3'}
            ], {
                animateRotate: false,
                percentageInnerCutout : 80,
                responsive: true
            });
            return this;
        },
        /**
         * @method load
         * @param {String} type
         * returns {PageStats}
         */
        load: function(type) {
            this.$('.content-section').hide();
            this.$('.navigation-text').removeClass('active');
            this.$('#navigation-section').show();
            if (type === 'timeline') {
                this.$('#link-timeline').addClass('active');
                this.$('#timeline-section').show();
            } else {
                this.$('#link-summary').addClass('active');
                this.$('#summary-section').show();
            }
            return this;
        }
    });

    return PageStats;

});