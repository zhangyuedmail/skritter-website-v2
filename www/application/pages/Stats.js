/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/stats.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageStats
     * @extends BasePage
     */
    var PageStats = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Stats';
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PageStats}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.resize();
            return this;
        },
        /**
         * @method resize
         * @returns {PageStats}
         */
        resize: function() {
            this.$('.content-box').css({
                height: this.getHeight() - 75,
                'overflow-y': 'auto'
            });
            return this;
        }
    });

    return PageStats;
});
