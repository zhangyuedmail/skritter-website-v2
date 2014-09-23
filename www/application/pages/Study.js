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
            this.scheduleIndex = 1;
            this.listenTo(app.user.schedule, 'sort', this.updateDueCount);
        },
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            app.timer.setElement(this.$('#study-timer'));
            this.elements.studyCount = this.$('#study-count');
            this.prompt = new PromptController({el: this.$('.prompt-container')}).render();
            this.listenTo(this.prompt, 'next', this.next);
            this.renderElements();
            this.next();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageStudy}
         */
        renderElements: function() {
            this.updateDueCount();
            return this;
        },
        /**
         * @method next
         */
        next: function() {
            var self = this;
            this.scheduleIndex++;
            this.schedule.getNext(this.scheduleIndex).load(function(result) {
                self.prompt.load(result.item.createReview());
            }, function() {
                self.next();
            });
        },
        /**
         * @method previous
         */
        previous: function() {},
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.elements.studyCount.text(app.user.schedule.getDueCount());
        }
    });

    return PageHome;
});
