/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/study.html',
    'prompts/PromptContainer'
], function(BasePage, TemplateDesktop, PromptContainer) {
    /**
     * @class PageStudy
     * @extends BasePage
     */
    var PageHome = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.study.title;
            this.prompt = undefined;
        },
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            this.prompt = new PromptContainer({el: this.$('.prompt-container')}).render();
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageStudy}
         */
        renderElements: function() {
            return this;
        }
    });

    return PageHome;
});
