/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/landing.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageLanding
     * @extends BasePage
     */
    var PageLanding = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.landing.title;
        },
        /**
         * @method render
         * @returns {PageLanding}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            return this;
        }
    });

    return PageLanding;
});
