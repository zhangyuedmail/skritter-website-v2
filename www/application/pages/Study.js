/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/mobile/study.html',
    'prompts/PromptController'
], function(BasePage, TemplateMobile, PromptController) {
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
            this.reviews = app.user.reviews;
            this.schedule = app.user.schedule;
            this.scheduleIndex = -1;
            this.listenTo(app.user.schedule, 'sort', this.updateDueCount);
        },
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            app.timer.updateOffset().setElement(this.$('#study-timer'));
            this.elements.studyCount = this.$('#study-count');
            this.promptController = new PromptController({el: this.$('.prompt-container')}).render();
            this.listenTo(this.promptController, 'prompt:complete', this.handlePromptComplete);
            this.renderElements().next();
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
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-add': 'handleAddButtonClicked',
            'vclick #button-info': 'handleInfoButtonClicked'
        }),
        /**
         * @method handleInfoButtonClicked
         * @param {Event} event
         */
        handleInfoButtonClicked: function(event) {
            event.preventDefault();
            app.sidebars.select('info').toggle();
        },
        /**
         * @method handleAddButtonClicked
         * @param {Event} event
         */
        handleAddButtonClicked: function(event) {
            event.preventDefault();
            app.dialogs.show().element('.message-title').text('Adding Items');
            app.user.data.items.fetchNew({limit: 5}, function() {
                app.dialogs.hide();
            }, function(error) {
                app.dialogs.element('.loader-image').hide();
                app.dialogs.element('.message-title').text(error);
                app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button("Go to 'My Lists'", {level: 'primary'}));
                app.dialogs.element('.message-close').html(app.fn.bootstrap.button("Close", {level: 'default'}));
                app.dialogs.element('.message-close button').on('vclick', function() {
                    app.dialogs.hide();
                });
                app.dialogs.element('.message-confirm button').on('vclick', function() {
                    app.dialogs.hide(function() {
                        app.router.navigate('list/sort/my-lists', {trigger: true});
                    });
                });
            });
        },
        /**
         * @method handlePromptComplete
         * @param {DataReview} review
         */
        handlePromptComplete: function(review) {
            console.log('REVIEW:', review.id, review);
            this.reviews.previous = review;
            review.save(_.bind(this.next, this));
        },
        /**
         * @method next
         */
        next: function() {
            var self = this;
            this.schedule.getNext(this.scheduleIndex).load(function(result) {
                self.prompt = self.promptController.loadPrompt(result.item.createReview());
                self.reviews.current = self.prompt.review;
            }, function() {
                self.scheduleIndex++;
                self.next();
            });
        },
        /**
         * @method remove
         */
        remove: function() {
            this.promptController.remove();
            BasePage.prototype.remove.call(this);
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
