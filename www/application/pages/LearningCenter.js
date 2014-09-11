/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/learning-center.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageLearningCenter
     * @extends BasePage
     */
    var PageLearningCenter = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings['learning-center'].title;
        },
        /**
         * @method render
         * @returns {PageLearningCenter}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            return this;
        }
    });

    return PageLearningCenter;
});
