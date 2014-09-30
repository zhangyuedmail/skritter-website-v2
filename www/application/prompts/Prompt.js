/**
 * @module Application
 */
define([
    'framework/BaseView'
], function(BaseView) {
    /**
     * @class Prompt
     * @extends {BaseView}
     */
    var Prompt = BaseView.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            this.canvas = controller.canvas;
            this.controller = controller;
            this.gradingButtons = controller.gradingButtons;
            this.item = review.getBaseItem();
            this.part = review.get('part');
            this.position = 1;
            this.review = review;
            this.teaching = false;
            this.vocab = review.getBaseVocab();
            //load canvas characters for rune and tone prompts
            if (['rune', 'tone'].indexOf(this.part) !== -1) {
                review.characters = this.item.getCanvasCharacters();
            }
            //show tutorial if not already disabled
            if (app.user.settings.hasTutorial(this.part)) {
                app.dialogs.show('tutorial-' + this.part);
                app.dialogs.element('.tutorial-reading').html(this.vocab.getReading());
                app.dialogs.element('.tutorial-writing').html(this.vocab.getWriting());
                app.dialogs.element('.tutorial-disable').on('vclick', _.bind(this.disableTutorial, this));
            }
        },
        /**
         * @property el
         * @type String
         */
        el: '.detail-container',
        /**
         * @method render
         * @returns {Prompt}
         */
        render: function() {
            this.position = this.review.getPosition();
            this.renderElements();
            if (this.review.getAt('answered')) {
                this.renderAnswer();
            } else {
                this.renderQuestion();
            }
            if (this.item.isNew()) {
                this.elements.promptNewness.text('NEW');
                this.elements.promptNewness.addClass('text-warning');
            } else {
                this.elements.promptNewness.text('');
            }
            if (this.vocab.isChinese()) {
                this.elements.promptStyle.text(this.vocab.getStyle().toUpperCase());
            }
            this.reset().resize();
            if (this.teaching) {
                this.teach();
            }
            this.updateVocabSidebar();
            this.loadFont();
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {Prompt}
         */
        renderAnswer: function() {
            app.timer.stop();
            this.review.setAt({
                answered: true,
                reviewTime: app.timer.getReviewTime(),
                thinkingTime: app.timer.getThinkingTime()
            });
            this.gradingButtons.select(this.review.getAt('score')).show();
            if (app.user.settings.hasTutorial('grading')) {
                app.dialogs.show('tutorial-grading');
                app.dialogs.element('.tutorial-disable').on('vclick', function() {
                    app.user.settings.disableTutorial('grading');
                    app.dialogs.hide();
                });
            }
            return this;
        },
        /**
         * @method renderElements
         * @returns {Prompt}
         */
        renderElements: function() {
            this.elements.fieldAnswer = this.$('.field-answer');
            this.elements.fieldDefinition = this.$('.field-definition');
            this.elements.fieldQuestion = this.$('.field-question');
            this.elements.fieldReading = this.$('.field-reading');
            this.elements.fieldWriting = this.$('.field-writing');
            this.elements.infoBan = $('#sidebar-info .info-ban');
            this.elements.infoDefinition = $('#sidebar-info .info-definition');
            this.elements.infoReading = $('#sidebar-info .info-reading');
            this.elements.infoStar = $('#sidebar-info .info-star');
            this.elements.infoWriting = $('#sidebar-info .info-writing');
            this.elements.promptNewness = this.$('.prompt-newness');
            this.elements.promptStyle = this.$('.prompt-style');
            this.elements.promptText = this.$('.prompt-text');
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {Prompt}
         */
        renderQuestion: function() {
            app.timer.setLapOffset(this.review.getAt('reviewTime'));
            app.timer.start();
            this.review.setAt('answered', false);
            this.gradingButtons.hide();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
            'swipeleft': 'handleSwipedLeft',
            'vclick': 'handlePromptClicked'
        }),
        /**
         * @method disableTutorial
         */
        disableTutorial: function() {
            app.user.settings.disableTutorial(this.part);
            app.dialogs.hide();
        },
        /**
         * @method editDefinition
         */
        editDefinition: function() {
            var self = this;
            //TODO: clean up interactions with sidebar
            app.dialogs.show('edit-text').element('.modal-title span').text('Edit Definition');
            var currentDefinition = this.vocab.getDefinition();
            app.dialogs.element('.dialog-value').text(currentDefinition);
            app.dialogs.element('.save').on('vclick', function() {
                var value = app.dialogs.element('.dialog-value').val();
                if (!value || value === '') {
                    value = currentDefinition;
                    self.vocab.set('customDefinition', undefined);
                } else if (currentDefinition !== value) {
                    self.vocab.set('customDefinition', value);
                } else {
                    value = currentDefinition;
                }
                $('#sidebar-info .info-definition').text(value);
                self.render();
                app.dialogs.hide();
            });
        },
        /**
         * @method enableCanvasListeners
         * @returns {Prompt}
         */
        enableListeners: function() {
            this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClicked);
            this.listenTo(this.canvas, 'canvas:clickhold', this.handleCanvasHeld);
            this.listenTo(this.canvas, 'canvas:doubleclick', this.handleCanvasDoubleClicked);
            this.listenTo(this.canvas, 'canvas:swipeup', this.handleCanvasSwipeUp);
            this.listenTo(this.canvas, 'input:down', this.handleInputDown);
            this.listenTo(this.canvas, 'input:up', this.handleInputUp);
            this.listenTo(this.gradingButtons, 'complete', this.handleGradingButtonsCompleted);
            this.listenTo(this.gradingButtons, 'selected', this.handleGradingButtonsSelected);
            this.listenTo(app.sidebars, 'click:edit-definition', this.editDefinition);
            this.listenTo(app.sidebars, 'click:info-ban', this.toggleBanned);
            this.listenTo(app.sidebars, 'click:info-star', this.toggleStarred);
            return this;
        },
        /**
         * @method handleGradingButtonsCompleted
         */
        handleGradingButtonsCompleted: function() {
            this.next();
        },
        /**
         * @method handleGradingButtonsSelected
         */
        handleGradingButtonsSelected: function(grade) {
            this.review.setAt('score', grade);
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handlePromptClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleSwipedLeft
         * @param {Event} event
         */
        handleSwipedLeft: function(event) {
            event.preventDefault();
            app.sidebars.select('info').show();
        },
        /**
         * @method next
         */
        next: function() {
            this.updateScore();
            if (this.review.isLast()) {
                this.controller.triggerPromptComplete(this.review);
            } else {
                this.review.next();
                this.render();
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            this.updateScore();
            if (this.review.isFirst()) {
                //TODO: allow for previous prompt navigation
                console.log('PROMPT: previous');
            } else {
                this.review.previous();
                this.render();
            }
        },
        /**
         * @method reset
         * @returns {Prompt}
         */
        reset: function() {
            this.stopListening();
            this.enableListeners();
            return this;
        },
        /**
         * @method resize
         * @returns {Prompt}
         */
        resize: function() {
            this.scaleText();
            return this;
        },
        /**
         * @method scaleText
         * @returns {Prompt}
         */
        scaleText: function() {
            var canvasSize = this.canvas.getWidth();
            this.$('.text-max').css('font-size', canvasSize / 12);
            this.$('.text-large').css('font-size', canvasSize / 16);
            this.$('.text-normal').css('font-size', canvasSize / 18);
            this.$('.text-small').css('font-size', canvasSize / 20);
            return this;
        },
        /**
         * @method teach
         * @returns {Prompt}
         */
        teach: function() {
            return this;
        },
        /**
         * @method toggleBanned
         */
        toggleBanned: function() {
            if (this.vocab.isBanned()) {
                this.vocab.set('bannedParts', []);
            } else {
                this.vocab.set('bannedParts', app.user.settings.getAllParts());
            }
            this.updateVocabSidebar();
        },
        /**
         * @method toggleStarred
         */
        toggleStarred: function() {
            if (this.vocab.isStarred()) {
                this.vocab.set('starred', false);
            } else {
                this.vocab.set('starred', true);
            }
            this.updateVocabSidebar();
        },
        /**
         * @method updateVocabSidebar
         * @returns {Prompt}
         */
        updateVocabSidebar: function() {
            this.elements.infoDefinition.text(this.vocab.getDefinition());
            this.elements.infoReading.html(this.vocab.getReading(null, {
                style: app.user.settings.get('readingStyle')
            }));
            this.elements.infoWriting.html(this.vocab.getWriting());
            if (this.vocab.isBanned()) {
                this.elements.infoBan.addClass('fa-star text-danger');
                this.elements.infoBan.removeClass('text-muted');
            } else {
                this.elements.infoBan.addClass('text-muted');
                this.elements.infoBan.removeClass('fa-star text-danger');
            }
            if (this.vocab.isStarred()) {
                this.elements.infoStar.addClass('fa-star text-warning');
                this.elements.infoStar.removeClass('fa-star-o');
            } else {
                this.elements.infoStar.addClass('fa-star-o');
                this.elements.infoStar.removeClass('fa-star text-warning');
            }
            return this;
        },
        /**
         * @method updateScore
         * @returns {Prompt}
         */
        updateScore: function() {
            this.review.setAt('score', this.gradingButtons.getScore());
            return this;
        }
    });

    return Prompt;
});
