/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/home.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageHome
     * @extends BasePage
     */
    var PageHome = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.home.title;
        },
        /**
         * @method render
         * @returns {PageHome}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            return this;
        }
    });

    return PageHome;
});
