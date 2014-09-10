/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/getting-started/language-select.html'
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
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick .language-select': 'handleLanguageSelected'
        }),
        /**
         * @method handleLanguageSelected
         * @param {Function} event
         */
        handleLanguageSelected: function(event) {
            event.preventDefault();
            app.router.showListSelect();
        }
    });

    return PageLanguageSelect;
});
