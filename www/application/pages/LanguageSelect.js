/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/language-select.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageLanguageSelect
     * @extends BasePage
     */
    var PageLanguageSelect = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.onboarding.title;
        },
        /**
         * @method render
         * @returns {PageLanguageSelect}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            return this;
        }
    });

    return PageLanguageSelect;
});
