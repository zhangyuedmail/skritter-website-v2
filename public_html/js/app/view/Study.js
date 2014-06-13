define([
    'require.text!template/study.html',
    'base/View',
    'view/prompt/Defn',
    'view/prompt/Rdng',
    'view/prompt/Rune',
    'view/prompt/Tone'
], function(template, BaseView) {
    /**
     * @class Study
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.prompt = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Study - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
            skritter.timer.setElement(this.$('.study-timer')).render();
            if (skritter.user.settings.get('hideCounter')) {
                this.$('.study-counter').hide();
            }
            if (skritter.user.settings.get('hideTimer')) {
                this.$('.study-timer').hide();
            }
            if (skritter.user.scheduler.review) {
                this.loadPrompt(skritter.user.scheduler.review);
            } else {
                this.nextPrompt();
            }
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
            BaseView.prototype.renderElements.call(this);
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-add-items': 'showAddItemsModal',
                'vclick .button-info': 'handleInfoButtonClicked',
                'vclick .button-study-settings': 'handleStudySetttingsClicked'
            });
        },
        /**
         * @method autoSync
         */
        autoSync: function() {
            if (skritter.user.settings.get('autoSync') &&
                    !skritter.user.sync.isActive() &&
                    skritter.user.data.reviews.length > skritter.user.settings.get('autoSyncThreshold')) {
                skritter.user.sync.reviews();
            }
        },
        /**
         * @method handleInfoButtonClicked
         * @param {Object} event
         */
        handleInfoButtonClicked: function(event) {
            skritter.router.navigate('vocab/info/' + skritter.user.getLanguageCode() + '/' + this.prompt.vocab.get('writing'), {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleStudySetttingsClicked
         * @param {Object} event
         */
        handleStudySetttingsClicked: function(event) {
            skritter.router.navigate('study/settings', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method loadPrompt
         * @param {Backbone.Model} review
         */
        loadPrompt: function(review) {
            if (this.prompt) {
                this.prompt.remove();
                this.stopListening(this.prompt);
            }
            this.prompt = review.createView();
            this.prompt.setElement(this.$('.prompt-container'));
            this.listenTo(this.prompt, 'prompt:next', _.bind(this.nextPrompt, this));
            this.listenTo(this.prompt, 'prompt:previous', _.bind(this.previousPrompt, this));
            skritter.user.scheduler.review = review;
            this.updateDueCounter();
            this.prompt.render();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            this.autoSync();
            skritter.user.scheduler.sort();
            skritter.user.scheduler.getNext(_.bind(function(item) {
                skritter.timer.reset();
                this.loadPrompt(item.createReview());
            }, this));
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            var review = skritter.user.data.reviews.at(0);
            if (review) {
                review.load(_.bind(function(review) {
                    this.loadPrompt(review);
                }, this));
            }
        },
        /**
         * @method showAddItemsModal
         * @param {Object} event
         */
        showAddItemsModal: function(event) {
            skritter.timer.stop();
            skritter.modal.show('add-items');
            skritter.modal.element('.modal-footer').hide();
            skritter.modal.element('.item-limit').val(skritter.user.settings.get('addItemAmount'));
            skritter.modal.element('.item-limit').on('vclick', function(event) {
                $(this).select();
                event.preventDefault();
            });
            skritter.modal.element('.button-add').on('vclick', _.bind(function(event) {
                var limit = skritter.modal.element('.item-limit').val();
                skritter.modal.element('.modal-footer').show();
                if (limit >= 1 && limit <= 100) {
                    skritter.modal.element(':input').prop('disabled', true);      
                    skritter.modal.element('.modal-progress-value').html("Looking for new items");
                    skritter.user.sync.addItems(limit, _.bind(function() {
                        skritter.user.settings.set('addItemAmount', limit);
                        this.updateDueCount();
                        skritter.modal.hide();
                        skritter.timer.start();
                    }, this), function(numVocabsAdded) {
                        if (numVocabsAdded > 0) {
                            skritter.modal.element('.modal-progress-value').html("Adding " + numVocabsAdded + " items");
                        }
                    });
                } else {
                    skritter.modal.element('.modal-progress-value').addClass('text-danger');
                    skritter.modal.element('.modal-progress-value').text('Must be between 1 and 100.');
                }
                event.preventDefault();
            }, this));
            if (event) {
                event.preventDefault();
            }
        },
        /**
         * @method updateDueCounter
         */
        updateDueCounter: function() {
            this.$('.study-counter').text(skritter.user.scheduler.getDueCount());
        }
    });
    
    return View;
});