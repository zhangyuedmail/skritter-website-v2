/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/study.html',
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
            this.scheduleIndex = 0;
            this.listenTo(app.user.data, 'sync', this.updateAddStatus);
            this.listenTo(app.user.schedule, 'sort', this.updateDueCount);
        },
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            app.timer.updateOffset().setElement(this.$('#study-timer'));
            this.elements.addItems = this.$('#button-add');
            this.elements.filterStatus = this.$('#filter-status');
            this.elements.studyCount = this.$('#study-count');
            this.promptController = new PromptController({el: this.$('.prompt-container')}).render();
            this.listenTo(this.promptController, 'prompt:complete', this.handlePromptComplete);
            this.listenTo(this.promptController, 'prompt:previous', this.previous);
            this.renderElements().next();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageStudy}
         */
        renderElements: function() {
            this.schedule.updateFilter();
            if (this.schedule.isFiltered()) {
                this.elements.filterStatus.show();
            } else {
                this.elements.filterStatus.hide();
            }
            this.updateDueCount();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-add': 'handleAddButtonClicked',
            'vclick #button-audio': 'handleAudioButtonClicked',
            'vclick #button-info': 'handleInfoButtonClicked'
        }),

        addItems: function(limit) {
            app.user.data.items.fetchNew({
                limit: limit || 1,
                lists: app.user.settings.getActiveLists()
            }, function(numVocabsAdded) {
                $.growl({
                    icon: 'fa fa-plus',
                    message: 'Added ' + numVocabsAdded + ' new vocabs.'
                }, {
                    allow_dismiss: false,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight'
                    },
                    offset: {x: 5, y: 50},
                    type: 'success'
                });
            }, function(error) {
                var message = '';
                if (error.statusCode === 402) {
                    message = 'Subscription required to add new vocabs.';
                } else {
                    if (app.user.data.vocablists.hasPaused()) {
                        message = 'You need to resume at least one paused list.';
                    } else {
                        message = 'You need to add another list to study.';
                    }
                }
                $.growl({
                    icon: 'fa fa-warning',
                    message: message
                }, {
                    allow_dismiss: false,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight'
                    },
                    offset: {x: 5, y: 50},
                    type: 'warning'
                });
            });
        },

        /**
         * @method handleAudioButtonClicked
         * @param {Event} event
         */
        handleAudioButtonClicked: function(event) {
            event.preventDefault();
            if (this.prompt) {
                app.analytics.trackEvent('Prompt', 'click', 'audio');
                this.prompt.vocab.playAudio();
            }
        },
        /**
         * @method handleInfoButtonClicked
         * @param {Event} event
         */
        handleInfoButtonClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Prompt', 'click', 'info');
            app.sidebars.select('info').toggle();
        },
        /**
         * @method handleAddButtonClicked
         * @param {Event} event
         */
        handleAddButtonClicked: function(event) {
            event.preventDefault();
            var self = this;
            app.timer.stop();
            app.analytics.trackEvent('Prompt', 'click', 'add items');
            app.dialogs.show('add-items');
            app.dialogs.element('.loader-image').hide();
            app.dialogs.element('.item-limit').show();
            app.dialogs.element('.message-title').text('How many items to add?');
            app.dialogs.element('.message-text').text('Select one of the quantities below.');
            app.dialogs.element('.item-limit').on('vclick', function(event) {
                self.addItems($(event.target).data('value'));
                app.dialogs.hide(function() {
                    app.timer.start();
                });
            });
            /**

             if (error) {
                    app.dialogs.element('.loader-image').hide();
                    if (error.statusCode === 402) {
                        app.dialogs.element('.message-title').text('Subscription required.');
                        app.dialogs.element('.message-text').text('You need an active subscription to add new items.');
                        app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button("Go to Account", {level: 'danger'}));
                        app.dialogs.element('.message-close').html(app.fn.bootstrap.button("Close", {level: 'default'}));
                        app.dialogs.element('.message-confirm button').on('vclick', function() {
                            app.dialogs.hide(function() {
                                app.router.navigate('account', {trigger: true});
                            });
                        });
                    } else {
                        if (app.user.data.vocablists.hasPaused()) {
                            app.dialogs.element('.message-text').text('You need to resume at least one paused list.');
                        } else {
                            app.dialogs.element('.message-text').text('You need to add another list to study.');
                        }
                        app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button("Go to My Lists", {level: 'primary'}));
                        app.dialogs.element('.message-close').html(app.fn.bootstrap.button("Close", {level: 'default'}));
                        app.dialogs.element('.message-confirm button').on('vclick', function() {
                            app.dialogs.hide(function() {
                                app.router.navigate('list/sort/my-lists', {trigger: true});
                            });
                        });
                    }
                    app.dialogs.element('.message-close button').on('vclick', function() {
                        app.dialogs.hide();
                        app.timer.start();
                    });
                } else {
                    if (self.prompt) {
                        app.timer.start();
                    } else {
                        self.next();
                    }
                    app.dialogs.hide();
                }

             */
        },
        /**
         * @method handlePromptComplete
         * @param {DataReview} review
         */
        handlePromptComplete: function(review) {
            console.log('REVIEW:', review.id, review);
            this.reviews.previous = review;
            this.schedule.addRecent(review.getBase());
            review.save(_.bind(this.next, this));
        },
        /**
         * @method next
         */
        next: function() {
            var self = this;
            var nextItem, review;
            if (this.scheduleIndex === -1 && this.reviews.current) {
                nextItem = this.schedule.get(this.reviews.current.get('itemId'));
                review = this.reviews.current;
            } else {
                nextItem = this.schedule.getNext(this.scheduleIndex);
            }
            if (nextItem) {
                nextItem.load(function(result) {
                    self.scheduleIndex = 0;
                    self.prompt = self.promptController.loadPrompt(review || result.item.createReview());
                    self.reviews.current = self.prompt.review;
                }, function() {
                    self.scheduleIndex++;
                    self.next();
                });

            } else {
                app.dialogs.show().element('.message-title').text('No items to study.');
                app.dialogs.element('.message-text').text("Try adding items if you have an active list. If not, go back and add one.");
                app.dialogs.element('.loader-image').hide();
                app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button("<i class='fa fa-plus'></i> Add Items", {level: 'primary'}));
                app.dialogs.element('.message-confirm button').on('vclick', function(event) {
                    app.dialogs.hide(function() {
                        self.handleAddButtonClicked(event);
                    });
                });
                app.dialogs.element('.message-close').html(app.fn.bootstrap.button("Go Back", {level: 'default'}));
                app.dialogs.element('.message-close button').on('vclick', function() {
                    app.router.navigate('', {replace: true, trigger: true});
                    app.dialogs.hide();
                });
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            var self = this;
            var previousItem = this.reviews.previous;
            if (previousItem && this.schedule.get(previousItem.get('itemId'))) {
                this.schedule.get(previousItem.get('itemId')).load(function() {
                    self.scheduleIndex = -1;
                    self.reviews.previous = undefined;
                    self.prompt = self.promptController.loadPrompt(previousItem);
                }, function() {
                    console.log('Unable to load previous item.');
                });
            } else {
                console.log('Unable to go back further.');
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            this.promptController.remove();
            BasePage.prototype.remove.call(this);
        },
        /**
         * @method updateAddStatus
         */
        updateAddStatus: function(status) {
            if (status) {
                this.elements.addItems.hide();
            } else {
                this.elements.addItems.show();
            }
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
