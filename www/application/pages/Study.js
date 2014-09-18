/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/study.html',
    'prompts/PromptController'
], function(BasePage, TemplateDesktop, PromptController) {
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
            this.schedule = app.user.schedule;
        },
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            this.prompt = new PromptController({el: this.$('.prompt-container')}).render();
            this.renderElements();
            this.next();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageStudy}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method next
         */
        next: function() {
            var self = this;
            this.schedule.getNext().load(function(result) {
                self.prompt.load(result.item.createReview());
            }, function() {
                self.next();
            });
        },
        /**
         * @method previous
         */
        previous: function() {}
    });

    return PageHome;
});
