define([
    'require.text!template/study.html',
    'view/prompt/Defn',
    'view/prompt/Rdng',
    'view/prompt/Rune',
    'view/prompt/Tone'
], function(templateStudy, Defn, Rdng, Rune, Tone) {
    /**
     * @class Study
     */
    var Study = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.prompt = null;
            this.listenTo(skritter.user.scheduler, 'schedule:sorted', _.bind(this.updateDueCount, this));
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            document.title = "Skritter - Study";
            this.$el.html(templateStudy);
            skritter.timer.setElement(this.$('#timer')).render();
            if (skritter.user.settings.get('hideTimer'))
                this.$('#timer').parent().hide();
            if (skritter.user.settings.get('hideDueCount'))
                this.$('#items-due').parent().hide();
            skritter.user.scheduler.sort();
            if (skritter.user.scheduler.data.length > 4) {
                this.nextPrompt();
            } else {
                this.showAddItemsModal();
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click #view-study .button-add-items': 'showAddItemsModal',
            'click #view-study .button-audio': 'playAudio',
            'click #view-study .button-study-settings': 'navigateStudySettings'
        },
        /**
         * @method checkAutoSync
         * @returns {Boolean}
         */
        checkAutoSync: function() {
            if (skritter.user.settings.get('autoSync') && skritter.user.data.reviews.length > skritter.user.settings.get('autoSyncThreshold')) {
                skritter.user.sync.changedItems(null, {holdReviews: 1});
                return true;
            }
            return false;
        },
        /**
         * @method loadPrompt
         * @param {Backbone.View} prompt
         */
        loadPrompt: function(prompt) {
            if (this.prompt) {
                this.prompt.remove();
                this.prompt = null;
            }
            this.prompt = prompt.setElement(this.$('#content-container')).render();
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.nextPrompt, this));
            this.updateAudioButtonState();
            this.updateDueCount();
        },
        /**
         * @method navigateStudySettings
         * @param {Object} event
         */
        navigateStudySettings: function(event) {
            skritter.router.navigate('study/settings', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            this.checkAutoSync();
            skritter.timer.reset();
            skritter.user.scheduler.getNext(_.bind(function(item) {
                var review = item.createReview();
                var prompt = null;
                switch (review.get('part')) {
                    case 'defn':
                        prompt = new Defn();
                        break;
                    case 'rdng':
                        prompt = new Rdng();
                        break;
                    case 'rune':
                        prompt = new Rune();
                        break;
                    case 'tone':
                        prompt = new Tone();
                        break;
                }
                prompt.set(review);
                this.loadPrompt(prompt);
            }, this));
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            this.prompt.review.getBaseVocab().playAudio();
            event.preventDefault();
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            //TODO: add in the ability to move backwards a few prompts
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method showAddItemsModal
         * @param {Object} event
         */
        showAddItemsModal: function(event) {
            skritter.modal.show('add-items');
            skritter.modal.element('.modal-footer').hide();
            skritter.modal.element('.item-limit').val(skritter.user.settings.get('addItemAmount'));
            skritter.modal.element('.item-limit').on('vclick', function(event) {
                $(this).select();
                event.preventDefault();
            });
            skritter.modal.element('.button-add').on('vclick', function(event) {
                var limit = skritter.modal.element('.item-limit').val();
                skritter.modal.element('.modal-footer').show();
                if (limit >= 1 && limit <= 100) {
                    skritter.modal.element(':input').prop('disabled', true);
                    skritter.modal.element('.message').addClass('text-info');
                    skritter.modal.element('.message').html("<i class='fa fa-spin fa-spinner'></i> Adding Items");
                    skritter.user.sync.addItems(limit, function() {
                        skritter.user.settings.set('addItemAmount', limit);
                        skritter.modal.hide();
                    });
                } else {
                    skritter.modal.element('.message').addClass('text-danger');
                    skritter.modal.element('.message').text('Must be between 1 and 100.');
                }
                event.preventDefault();
            });
            if (event) {
                event.preventDefault();
            }
        },
        /**
         * @method updateAudioButtonState
         */
        updateAudioButtonState: function() {
            if (this.prompt && this.prompt.review.getBaseVocab().has('audio')) {
                this.$('.button-audio i').removeClass('fa fa-volume-off');
                this.$('.button-audio i').addClass('fa fa-volume-up');
            } else {
                this.$('.button-audio i').removeClass('fa fa-volume-up');
                this.$('.button-audio i').addClass('fa fa-volume-off');
            }
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.$('#items-due').html(skritter.user.scheduler.getDueCount());
        }
    });
    
    return Study;
});