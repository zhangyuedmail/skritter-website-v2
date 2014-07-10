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
    var Study = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.prompt = null;
            this.listenTo(skritter.user.scheduler, 'sorted', _.bind(this.updateDueCounter, this));
            this.listenTo(skritter.user.data, 'change:syncing', _.bind(this.toggleAddButton, this));
        },
        /**
         * @method render
         * @returns {Study}
         */
        render: function() {
            this.setTitle('Study');
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            if (skritter.user.data.get('syncing')) {
                this.toggleAddButton(true);
            }
            if (!skritter.user.scheduler.hasData()) {
                this.showAddItemsModal();
                skritter.router.navigate('', {replace: true, trigger: true});
                return false;
            }
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
            this.updateDueCounter();
            return this;
        },
        /**
         * @method loadElements
         * @returns {Study}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.buttonAdditems = this.$('.button-add-items');
            this.elements.userAvatar = this.$('.user-avatar');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-add-items': 'handleAddItemsClicked',
                'vclick .button-info': 'handleInfoButtonClicked',
                'vclick .button-study-settings': 'handleStudySetttingsClicked',
                'vclick .navbar-back': 'handleBackClick'
            });
        },
        /**
         * @method handleAddItemsClicked
         * @param {Object} event
         */
        handleAddItemsClicked: function(event) {
            skritter.modal.showAddItems();
            event.preventDefault();
        },
        /**
         * @method handleBackClick
         * @param {Object} event
         */
        handleBackClick: function(event) {
            skritter.router.navigate('', {replace: true, trigger: true});
            event.preventDefault();
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
                this.prompt = null;
            }
            this.prompt = review.createView();
            this.prompt.setElement(this.$('.prompt-container'));
            this.listenTo(this.prompt, 'prompt:next', _.bind(this.nextPrompt, this));
            this.listenTo(this.prompt, 'prompt:previous', _.bind(this.previousPrompt, this));
            skritter.user.scheduler.review = review;
            this.prompt.render();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            skritter.timer.reset();
            skritter.user.data.reset();
            skritter.user.scheduler.getNext(_.bind(function(item) {
                this.loadPrompt(item.createReview());
            }, this));
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            var review = skritter.user.data.reviews.at(0);
            if (review) {
                skritter.user.data.reset();
                review.load(_.bind(function(review) {
                    this.loadPrompt(review);
                }, this));
            }
        },
        /**
         * @method toggleAddButton
         * @param {Backbone.Model} model
         * @param {Boolean} value
         */
        toggleAddButton: function(model, value) {
            if (value) {
                this.elements.buttonAdditems.addClass('invisible');
            } else {
                this.elements.buttonAdditems.removeClass('invisible');
            }
        },
        /**
         * @method updateDueCounter
         */
        updateDueCounter: function() {
            this.$('.study-counter').text(skritter.user.scheduler.getDueCount());
        }
    });

    return Study;
});