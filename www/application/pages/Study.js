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
            this.promptController = undefined;
            this.reviews = app.user.data.reviews;
            this.schedule = app.user.schedule;
            this.scheduleIndex = 0;
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
            this.promptController = new PromptController({el: this.$('.prompt-container')}).render();
            this.listenTo(this.promptController, 'prompt:complete', this.handlePromptComplete);
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
         * @method handlePromptComplete
         * @param {DataReview} review
         */
        handlePromptComplete: function(review) {
            console.log('REVIEW:', review.id, review);
            review.save(_.bind(this.next, this));
        },
        /**
         * @method next
         */
        next: function() {
            var self = this;
            this.schedule.getNext(this.scheduleIndex).load(function(result) {
                self.prompt = self.promptController.loadPrompt(result.item.createReview());
            }, function() {
                self.scheduleIndex++;
                self.next();
            });
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.elements.studyCount.text(app.user.schedule.getDueCount());
        }
    });

    return PageHome;
});
