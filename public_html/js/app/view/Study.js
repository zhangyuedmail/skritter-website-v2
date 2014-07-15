define([
    'require.text!template/study.html',
    'view/View',
    'view/prompt/Container'
], function(template, View, PromptContainer) {
    /**
     * @class Study
     */
    var Study = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
            this.promptContainer = new PromptContainer();
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
            skritter.timer.setElement(this.$('.study-timer')).render();
            this.promptContainer.setElement(this.$('#content')).render();

            this.listenTo(this.promptContainer, 'next', this.nextPrompt);
            this.listenTo(this.promptContainer, 'previous', this.previousPrompt);

            this.preloadFont();
            this.loadElements();

            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            if (skritter.user.data.get('syncing')) {
                this.toggleAddButton(true);
            }
            if (!skritter.user.scheduler.hasData()) {
                this.showAddItemsModal();
                skritter.router.navigate('', {replace: true, trigger: true});
                return false;
            }
            if (skritter.user.settings.get('hideCounter')) {
                this.$('.study-counter').hide();
            }
            if (skritter.user.settings.get('hideTimer')) {
                this.$('.study-timer').hide();
            }

            //TODO: load prompt stuff here
            this.nextPrompt();

            this.updateDueCounter();
            return this;
        },
        /**
         * @method loadElements
         */
        loadElements: function() {
            this.elements.buttonAdditems = this.$('.button-add-items');
            this.elements.userAvatar = this.$('.user-avatar');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, View.prototype.events, {
                'vclick .button-add-items': 'handleAddItemsClicked',
                'vclick .button-info': 'handleInfoButtonClicked',
                'vclick .button-study-settings': 'handleStudySettingsClicked',
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
         * @method handleStudySettingsClicked
         * @param {Object} event
         */
        handleStudySettingsClicked: function(event) {
            skritter.router.navigate('study/settings', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            console.log('nexting');
            skritter.user.scheduler.getNext(_.bind(function(item) {
                this.promptContainer.loadPrompt(item.createReview());
            }, this));
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            console.log('previousing');
        },
        /**
         * @method toggleAddButton
         * @param {Backbone.Model} model
         * @param {Boolean} value
         */
        toggleAddButton: function(model, value) {
            if (value) {
                this.elements.buttonAdditems.hide();
            } else {
                this.elements.buttonAdditems.show();
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