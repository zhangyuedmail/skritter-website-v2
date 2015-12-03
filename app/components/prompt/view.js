var GelatoComponent = require('gelato/component');

var Prompt = require('components/prompt/view');
var PromptCanvas = require('components/prompt/canvas/view');
var PromptToolbarAction = require('components/prompt/toolbar-action/view');
var PromptToolbarGrading = require('components/prompt/toolbar-grading/view');
var PromptToolbarVocab = require('components/prompt/toolbar-vocab/view');
var PromptVocabContained = require('components/prompt/vocab-contained/view');
var PromptVocabDefinition = require('components/prompt/vocab-definition/view');
var PromptVocabMnemonic = require('components/prompt/vocab-mnemonic/view');
var PromptVocabReading = require('components/prompt/vocab-reading/view');
var PromptVocabSentence = require('components/prompt/vocab-sentence/view');
var PromptVocabStyle = require('components/prompt/vocab-style/view');
var PromptVocabWriting = require('components/prompt/vocab-writing/view');

//TODO: merge into template container
var ConfirmBanDialog = require('dialogs/confirm-ban/view');
var VocabDialog = require('dialogs/vocab/view');

/**
 * @class Prompt
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        //properties
        this.editing = false;
        this.loaded = false;
        this.part = null;
        this.reviews = null;
        //components
        this.canvas = new PromptCanvas({prompt: this});
        this.toolbarAction = new PromptToolbarAction({prompt: this});
        this.toolbarGrading = new PromptToolbarGrading({prompt: this});
        this.toolbarVocab = new PromptToolbarVocab({prompt: this});
        this.vocabContained = new PromptVocabContained({prompt: this});
        this.vocabDefinition = new PromptVocabDefinition({prompt: this});
        this.vocabMnemonic = new PromptVocabMnemonic({prompt: this});
        this.vocabReading = new PromptVocabReading({prompt: this});
        this.vocabSentence = new PromptVocabSentence({prompt: this});
        this.vocabStyle = new PromptVocabStyle({prompt: this});
        this.vocabWriting = new PromptVocabWriting({prompt: this});
        //keypress
        this.keypressAction = new keypress.Listener();
        this.keypressGrading = new keypress.Listener();
        this.keypressNavigate = new keypress.Listener();
        this.keypressTone = new keypress.Listener();
        this.registerKeypress();
        //listeners
        this.listenTo(this.canvas, 'attempt:fail', this.handleCanvasAttemptFail);
        this.listenTo(this.canvas, 'attempt:success', this.handleCanvasAttemptSuccess);
        this.listenTo(this.canvas, 'click', this.handleCanvasClick);
        this.listenTo(this.canvas, 'complete', this.handleCanvasComplete);
        this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
        this.listenTo(this.canvas, 'navigate:next', this.handleCanvasNavigateNext);
        this.listenTo(this.canvas, 'navigate:previous', this.handleCanvasNavigatePrevious);
        this.listenTo(this.canvas, 'swipeup', this.handleCanvasSwipeUp);
        this.listenTo(this.canvas, 'tap', this.handleCanvasTap);
        this.listenTo(this.toolbarAction, 'click:correct', this.handleToolbarActionCorrect);
        this.listenTo(this.toolbarAction, 'click:erase', this.handleToolbarActionErase);
        this.listenTo(this.toolbarAction, 'click:show', this.handleToolbarActionShow);
        this.listenTo(this.toolbarAction, 'click:teach', this.handleToolbarActionTeach);
        this.listenTo(this.toolbarGrading, 'mouseup', this.handleToolbarGradingMouseup);
        this.listenTo(this.toolbarGrading, 'mousedown', this.handleToolbarGradingMousedown);
        this.listenTo(this.toolbarVocab, 'click:audio', this.handleToolbarVocabAudio);
        this.listenTo(this.toolbarVocab, 'click:ban', this.handleToolbarVocabBan);
        this.listenTo(this.toolbarVocab, 'click:edit', this.handleToolbarVocabEdit);
        this.listenTo(this.toolbarVocab, 'click:info', this.handleToolbarVocabInfo);
        this.listenTo(this.toolbarVocab, 'click:star', this.handleToolbarVocabStar);
        this.listenTo(this.vocabContained, 'click:show', this.handleVocabContainedShow);
        this.listenTo(this.vocabDefinition, 'click:show', this.handleVocabDefinitionShow);
        this.listenTo(this.vocabMnemonic, 'click:show', this.handleVocabMnemonicShow);
        this.listenTo(this.vocabReading, 'click:show', this.handleVocabReadingShow);
        this.on('resize', this.resize);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Prompt}
     */
    render: function() {
        this.renderTemplate();
        this.canvas.setElement('#canvas-container');
        this.toolbarAction.setElement('#toolbar-action-container');
        this.toolbarGrading.setElement('#toolbar-grading-container');
        this.toolbarVocab.setElement('#toolbar-vocab-container');
        this.vocabContained.setElement('#vocab-contained-container');
        this.vocabDefinition.setElement('#vocab-definition-container');
        this.vocabMnemonic.setElement('#vocab-mnemonic-container');
        this.vocabReading.setElement('#vocab-reading-container');
        this.vocabSentence.setElement('#vocab-sentence-container');
        this.vocabStyle.setElement('#vocab-style-container');
        this.vocabWriting.setElement('#vocab-writing-container');
        if (this.reviews) {
            this.canvas.render();
        }
        return this;
    },
    /**
     * @method renderPrompt
     * @returns {Prompt}
     */
    renderPrompt: function() {
        this.review = this.reviews.current();
        switch (this.part) {
            case 'defn':
                this.renderPromptPartDefn();
                break;
            case 'rdng':
                this.renderPromptPartRdng();
                break;
            case 'rune':
                this.renderPromptPartRune();
                break;
            case 'tone':
                this.renderPromptPartTone();
                break;
        }
        if (this.reviews.isFirst()) {
            this.$('#navigate-previous').hide();
        } else {
            this.$('#navigate-previous').show();
        }
        return this;
    },
    /**
     * @method renderPromptComplete
     * @returns {Prompt}
     */
    renderPromptComplete: function() {
        this.review = this.reviews.current();
        switch (this.part) {
            case 'defn':
                this.renderPromptPartDefnComplete();
                break;
            case 'rdng':
                this.renderPromptPartRdngComplete();
                break;
            case 'rune':
                this.renderPromptPartRuneComplete();
                break;
            case 'tone':
                this.renderPromptPartToneComplete();
                break;
        }
        return this;
    },
    /**
     * @method renderPromptLoad
     * @returns {Prompt}
     */
    renderPromptLoad: function() {
        this.canvas.definition.render();
        this.canvas.reading.render();
        this.toolbarAction.render();
        this.toolbarGrading.render();
        this.toolbarVocab.render();
        this.vocabContained.render();
        this.vocabDefinition.render();
        this.vocabMnemonic.render();
        this.vocabReading.render();
        this.vocabSentence.render();
        this.vocabStyle.render();
        this.vocabWriting.render();
        return this;
    },
    /**
     * @method renderPromptPartDefn
     * @returns {Prompt}
     */
    renderPromptPartDefn: function() {
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.canvas.definition.render();
            this.keypressGrading.stop_listening();
            this.keypressTone.stop_listening();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.hide();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabReading.render();
            this.review.start();
            this.trigger('review:start', this.reviews);
        }
        return this;
    },
    /**
     * @method renderPromptPartDefnComplete
     * @returns {Prompt}
     */
    renderPromptPartDefnComplete: function() {
        if (this.review.isComplete()) {
            this.trigger('review:stop', this.reviews);
            this.review.stop();
            this.canvas.definition.render();
            this.keypressGrading.listen();
            this.keypressTone.stop_listening();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.select(this.review.get('score'));
            this.toolbarGrading.show();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabMnemonic.render();
            this.vocabReading.render();
            if (app.user.isAudioEnabled()) {
                this.reviews.vocab.play();
            }
        } else {
            this.renderPromptPartDefn();
        }
        return this;
    },
    /**
     * @method renderPromptPartRdng
     * @returns {Prompt}
     */
    renderPromptPartRdng: function() {
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.canvas.reading.render();
            this.keypressGrading.stop_listening();
            this.keypressTone.stop_listening();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.hide();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabReading.render();
            this.review.start();
            this.trigger('review:start', this.reviews);
        }
        return this;
    },
    /**
     * @method renderPromptPartRdngComplete
     * @returns {Prompt}
     */
    renderPromptPartRdngComplete: function() {
        if (this.review.isComplete()) {
            this.trigger('review:stop', this.reviews);
            this.review.stop();
            this.canvas.reading.render();
            this.keypressGrading.listen();
            this.keypressTone.stop_listening();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.select(this.review.get('score'));
            this.toolbarGrading.show();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabMnemonic.render();
            this.vocabReading.render();
            if (app.user.isAudioEnabled()) {
                this.reviews.vocab.play();
            }
        } else {
            this.renderPromptPartRdng();
        }
        return this;
    },
    /**
     * @method renderPromptPartRune
     * @returns {Prompt}
     */
    renderPromptPartRune: function() {
        this.canvas.reset();
        this.canvas.redrawCharacter();
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.keypressGrading.stop_listening();
            this.keypressTone.stop_listening();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = true;
            this.toolbarAction.buttonShow = true;
            this.toolbarAction.buttonTeach = true;
            this.toolbarAction.render();
            this.toolbarGrading.hide();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabReading.render();
            this.vocabWriting.render();
            this.canvas.enableInput();
            this.review.start();
            this.trigger('review:start', this.reviews);
            if (app.user.isAudioEnabled() &&
                !app.user.get('hideReading') &&
                this.reviews.isFirst()) {
                this.reviews.vocab.play();
            }
            if (this.reviews.isTeachable()) {
                this.canvas.startTeaching();
                this.review.set('score', 1);
                this.review.set('teach', true);
            }
        }
        return this;
    },
    /**
     * @method renderPromptPartRuneComplete
     * @returns {Prompt}
     */
    renderPromptPartRuneComplete: function() {
        if (this.review.isComplete()) {
            this.trigger('review:stop', this.reviews);
            this.review.stop();
            this.review.set('teach', false);
            this.canvas.disableInput();
            this.canvas.stopTeaching();
            this.keypressTone.stop_listening();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = true;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabMnemonic.render();
            this.vocabReading.render();
            this.vocabSentence.render();
            this.vocabWriting.render();
            if (app.user.isAudioEnabled() &&
                app.user.get('hideReading') &&
                this.reviews.isLast()) {
                this.reviews.vocab.play();
            }
            if (this.reviews.isTeachable()) {
                this.review.set('score', 1);
                this.toolbarGrading.deselect();
                this.toolbarGrading.hide();
            } else {
                this.keypressGrading.listen();
                this.toolbarGrading.select(this.review.get('score'));
                this.toolbarGrading.show();
                this.canvas.injectGradingColor();
            }
            if (app.user.get('squigs')) {
                this.canvas.showCharacterReveal();
            }
        } else {
            this.renderPromptPartRune();
        }
        return this;
    },
    /**
     * @method renderPromptPartTone
     * @returns {Prompt}
     */
    renderPromptPartTone: function() {
        this.canvas.reset();
        this.canvas.redrawCharacter();
        this.canvas.showCharacterReveal();
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.keypressGrading.stop_listening();
            this.keypressTone.listen();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.render();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabReading.render();
            this.vocabWriting.render();
            this.canvas.enableInput();
            this.review.start();
            this.trigger('review:start', this.reviews);
        }
        return this;
    },
    /**
     * @method renderPromptPartToneComplete
     * @returns {Prompt}
     */
    renderPromptPartToneComplete: function() {
        if (this.review.isComplete()) {
            this.trigger('review:stop', this.reviews);
            this.review.stop();
            this.review.set('teach', false);
            this.canvas.disableInput();
            this.canvas.injectGradingColor();
            this.canvas.stopTeaching();
            this.keypressGrading.listen();
            this.keypressTone.stop_listening();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.render();
            this.toolbarGrading.select(this.review.get('score'));
            this.toolbarGrading.show();
            this.vocabContained.render();
            this.vocabDefinition.render();
            this.vocabMnemonic.render();
            this.vocabReading.render();
            this.vocabWriting.render();
            if (app.user.isAudioEnabled() && this.reviews.isLast()) {
                this.reviews.vocab.play();
            }
        } else {
            this.renderPromptPartTone();
        }
        return this;
    },
    /**
     * @method handleCanvasAttemptFail
     */
    handleCanvasAttemptFail: function() {
        switch (this.part) {
            case 'rune':
                this.review.set('failedConsecutive', this.review.get('failedConsecutive') + 1);
                this.review.set('failedTotal', this.review.get('failedTotal') + 1);
                if (this.review.get('failedTotal') > 3) {
                    this.review.set('score', 1);
                } else if (this.review.get('failedTotal') > 2) {
                    this.review.set('score', 2);
                }
                if (this.review.get('failedConsecutive') > 3) {
                    this.canvas.showStrokeHint();
                }
                break;
            case 'tone':
                this.review.set('score', 1);
                break;
        }

    },
    /**
     * @method handleCanvasAttemptSuccess
     */
    handleCanvasAttemptSuccess: function() {
        switch (this.part) {
            case 'rune':
                this.review.set('failedConsecutive', 0);
                if (this.review.get('teach')) {
                    this.canvas.startTeaching();
                }
                break;
            case 'tone':
                this.review.set('score', 3);
                break;
        }
    },
    /**
     * @method handleCanvasClick
     */
    handleCanvasClick: function() {
        if (this.review.isComplete()) {
            this.next();
        } else {
            switch (this.part) {
                case 'defn':
                    this.review.set('complete', true);
                    this.renderPromptComplete();
                    break;
                case 'rdng':
                    this.review.set('complete', true);
                    this.renderPromptComplete();
                    break;
                case 'rune':
                    this.canvas.fadeCharacterHint();
                    break;
            }
        }

    },
    /**
     * @method handleCanvasComplete
     */
    handleCanvasComplete: function() {
        this.review.set('complete', true);
        switch (this.part) {
            case 'defn':
                this.renderPromptPartDefnComplete();
                break;
            case 'rdng':
                this.renderPromptPartRdngComplete();
                break;
            case 'rune':
                this.renderPromptPartRuneComplete();
                break;
            case 'tone':
                this.renderPromptPartToneComplete();
                break;
        }
    },
    /**
     * @method handleCanvasInputUp
     */
    handleCanvasInputUp: function() {
        switch (this.part) {
            case 'rune':
                this.review.stopThinking();
                break;
            case 'tone':
                this.review.stopThinking();
                break;
        }
    },
    /**
     * @method handleCanvasNavigateNext
     */
    handleCanvasNavigateNext: function() {
        this.trigger('review:stop', this.reviews);
        this.review.stop();
        this.next();
    },
    /**
     * @method handleCanvasNavigatePrevious
     */
    handleCanvasNavigatePrevious: function() {
        this.trigger('review:stop', this.reviews);
        this.review.stop();
        this.previous();
    },
    /**
     * @method handleCanvasSwipeUp
     */
    handleCanvasSwipeUp: function() {
        switch (this.part) {
            case 'rune':
                this.review.set({complete: false, teach: false});
                this.review.character.reset();
                this.renderPrompt();
                break;
        }
    },
    /**
     * @method handleCanvasTap
     */
    handleCanvasTap: function() {
        switch (this.part) {
            case 'rune':
                this.canvas.showStrokeHint();
                break;
        }
    },
    /**
     * @method handleKeypressActionAudio
     */
    handleKeypressActionAudio: function() {
        this.reviews.vocab.play();
    },
    /**
     * @method handleKeypressActionErase
     */
    handleKeypressActionErase: function() {
        switch (this.part) {
            case 'rune':
                this.review.set({complete: false, teach: false});
                this.review.character.reset();
                this.renderPrompt();
                break;
        }
    },
    /**
     * @method handleKeypressActionShow
     */
    handleKeypressActionShow: function() {
        switch (this.part) {
            case 'rune':
                this.review.set('score', 1);
                this.canvas.showCharacterHint();
                break;
        }
    },
    /**
     * @method handleKeypressActionTeach
     */
    handleKeypressActionTeach: function() {
        switch (this.part) {
            case 'rune':
                this.review.set({score: 1, teach: true});
                this.canvas.startTeaching();
                break;
        }
    },
    /**
     * @method handleKeypressGradingKeydown
     * @param {Number} value
     */
    handleKeypressGradingKeydown: function(value) {
        if (this.review.isComplete()) {
            this.toolbarGrading.select(value);
            this.review.set('score', value);
            this.canvas.injectGradingColor();
        }
    },
    /**
     * @method handleKeypressGradingKeyup
     * @param {Number} value
     */
    handleKeypressGradingKeyup: function(value) {
        if (this.review.isComplete()) {
            this.review.set('score', value);
            this.next();
        }
    },
    /**
     * @method handleKeypressGradingToggle
     */
    handleKeypressGradingToggle: function() {
        if (this.review.isComplete()) {
            var score = this.review.get('score') === 1 ? 3 : 1;
            this.toolbarGrading.select(score);
            this.review.set('score', score);
            this.canvas.injectGradingColor();
        }
    },
    /**
     * @method handleKeypressActionErase
     */
    handleKeypressNavigateNext: function() {
        this.trigger('review:stop', this.reviews);
        this.review.stop();
        this.next();
    },
    /**
     * @method handleKeypressNavigatePrevious
     */
    handleKeypressNavigatePrevious: function() {
        this.trigger('review:stop', this.reviews);
        this.review.stop();
        this.previous();
    },
    /**
     * @method handleKeypressNavigateReveal
     */
    handleKeypressNavigateReveal: function() {
        switch (this.part) {
            case 'rune':
                if (this.review.isComplete()) {
                    this.handleKeypressNavigateNext();
                } else {
                    this.canvas.completeCharacter();
                    this.canvas.injectGradingColor();
                    this.review.set('complete', true);
                    this.renderPromptComplete();
                }
                break;
            case 'tone':
                if (this.review.isComplete()) {
                    this.handleKeypressNavigateNext();
                } else {
                    this.canvas.completeCharacter();
                    this.canvas.injectGradingColor();
                    this.review.set('complete', true);
                    this.renderPromptComplete();
                }
                break;
            default:
                if (this.review.isComplete()) {
                    this.next();
                } else {
                    this.review.set('complete', true);
                    this.renderPromptComplete();
                }
        }
    },
    /**
     * @method handleKeypressToneKeydown
     * @param {Number} value
     */
    handleKeypressToneKeydown: function(value) {
        var character = this.review.character;
        var possibleTones = this.review.getTones();
        var expectedTone = character.getTone(possibleTones[0]);
        if (possibleTones.indexOf(value) > -1) {
            character.reset();
            character.add(character.getTone(value));
            this.canvas.drawShape('character', character.getTone(value).getTargetShape());
            this.canvas.trigger('attempt:success');
        } else {
            character.reset();
            character.add(expectedTone);
            this.canvas.drawShape('character', expectedTone.getTargetShape());
            this.canvas.trigger('attempt:fail');
        }
        if (character.isComplete()) {
            this.canvas.trigger('complete');
        }
    },
    /**
     * @method handleToolbarActionCorrect
     */
    handleToolbarActionCorrect: function() {
        this.review.set('score', this.review.get('score') > 1 ? 1 : 3);
        this.toolbarAction.render();
        if (this.review.isComplete()) {
            this.toolbarGrading.select(this.review.get('score'));
            this.canvas.injectGradingColor();
        }
    },
    /**
     * @method handleToolbarActionErase
     */
    handleToolbarActionErase: function() {
        switch (this.part) {
            case 'rune':
                this.review.set({complete: false, teach: false});
                this.review.character.reset();
                this.renderPrompt();
                break;
        }
    },
    /**
     * @method handleToolbarActionShow
     */
    handleToolbarActionShow: function() {
        switch (this.part) {
            case 'rune':
                this.review.set('score', 1);
                this.canvas.showCharacterHint();
                break;
        }
    },
    /**
     * @method handleToolbarActionTeach
     */
    handleToolbarActionTeach: function() {
        switch (this.part) {
            case 'rune':
                this.review.set({score: 1, teach: true});
                this.canvas.startTeaching();
                break;
        }
    },
    /**
     * @method handleToolbarGradingMousedown
     * @param {Number} value
     */
    handleToolbarGradingMousedown: function(value) {
        if (this.review.isComplete()) {
            this.review.set('score', value);
            this.canvas.injectGradingColor();
        }
    },
    /**
     * @method handleToolbarGradingMouseup
     * @param {Number} value
     */
    handleToolbarGradingMouseup: function(value) {
        if (this.review.isComplete()) {
            this.review.set('score', value);
            this.next();
        }
    },
    /**
     * @method handleToolbarVocabAudio
     */
    handleToolbarVocabAudio: function() {
        this.reviews.vocab.play();
    },
    /**
     * @method handleToolbarVocabBan
     */
    handleToolbarVocabBan: function() {
        var dialog = new ConfirmBanDialog();
        dialog.on('ban', _.bind(function() {
            this.reviews.item.ban();
            this.reviews.vocab.save(null, {
                complete: _.bind(function() {
                    this.trigger('skip', this.reviews);
                    dialog.close();
                }, this)
            });
        }, this));
        dialog.open();
    },
    /**
     * @method handleToolbarVocabEdit
     */
    handleToolbarVocabEdit: function() {
        if (this.editing) {
            this.editing = false;
            this.registerKeypress();
            this.vocabDefinition.editable = false;
            this.vocabMnemonic.editable = false;
            this.reviews.vocab.save({
                customDefinition: this.vocabDefinition.getValue(),
                mnemonic: this.vocabMnemonic.getValue()
            });
        } else {
            this.editing = true;
            this.unregisterKeypress();
            this.vocabDefinition.editable = true;
            this.vocabMnemonic.editable = true;

        }
        this.vocabDefinition.render();
        this.vocabMnemonic.render();
    },
    /**
     * @method handleToolbarVocabInfo
     */
    handleToolbarVocabInfo: function() {
        var dialog = new VocabDialog();
        dialog.open().load(this.reviews.vocab.id);
    },
    /**
     * @method handleToolbarVocabStar
     */
    handleToolbarVocabStar: function() {
        this.reviews.vocab.toggleStarred();
        this.reviews.vocab.save(null, {
            complete: _.bind(function() {
                this.toolbarVocab.render();
            }, this)
        });
    },
    /**
     * @method handleVocabContainedShow
     */
    handleVocabContainedShow: function() {
        this.review.set('showContained', true);
        this.vocabContained.render();
    },
    /**
     * @method handleVocabDefinitionShow
     */
    handleVocabDefinitionShow: function() {
        this.reviews.forEach(function(review) {
            review.set('showDefinition', true);
        });
        this.vocabDefinition.render();
    },
    /**
     * @method handleVocabMnemonicShow
     */
    handleVocabMnemonicShow: function() {
        this.review.set('showMnemonic', true);
        this.vocabMnemonic.render();
    },
    /**
     * @method handleVocabReadingShow
     * @param {Number} position
     */
    handleVocabReadingShow: function(position) {
        if (this.reviews.isChinese()) {
            this.reviews.at(position).set('showReading', true);
        } else {
            this.reviews.forEach(function(review) {
                review.set('showReading', true);
            });
        }
        this.vocabReading.render();
    },
    /**
     * @method next
     */
    next: function() {
        if (this.reviews.isLast()) {
            this.trigger('next', this.reviews);
        } else {
            this.reviews.next();
            this.trigger('review:next', this.reviews);
            this.renderPrompt()
        }
    },
    /**
     * @method previous
     */
    previous: function() {
        if (this.reviews.isFirst()) {
            this.trigger('previous', this.reviews);
        } else {
            this.reviews.previous();
            this.trigger('review:previous', this.reviews);
            this.renderPrompt();
        }
    },
    /**
     * @method registerKeypress
     */
    registerKeypress: function() {
        this.keypressAction.register_many([
            {
                'keys': 'apostrophe',
                'on_keydown': _.bind(this.handleKeypressActionAudio, this),
                'prevent_repeat': true
            },
            {
                'keys': 'up',
                'on_keydown': _.bind(this.handleKeypressActionShow, this),
                'prevent_repeat': true
            },
            {
                'keys': '.',
                'on_keydown': _.bind(this.handleKeypressActionErase, this),
                'prevent_repeat': true
            },
            {
                'keys': 'a',
                'on_keydown': _.bind(this.handleKeypressActionAudio, this),
                'prevent_repeat': true
            },
            {
                'keys': 'l',
                'on_keydown': _.bind(this.handleKeypressActionShow, this),
                'prevent_repeat': true
            },
            {
                'keys': 's',
                'on_keydown': _.bind(this.handleKeypressActionShow, this),
                'prevent_repeat': true
            },
            {
                'keys': 't',
                'on_keydown': _.bind(this.handleKeypressActionTeach, this),
                'prevent_repeat': true
            },
            {
                'keys': 'x',
                'on_keydown': _.bind(this.handleKeypressActionErase, this),
                'prevent_repeat': true
            }
        ]);
        this.keypressGrading.register_many([
            {
                'keys': 'down',
                'on_keydown': _.bind(this.handleKeypressGradingToggle, this),
                'prevent_repeat': true
            },
            {
                'keys': 'm',
                'on_keydown': _.bind(this.handleKeypressGradingToggle, this),
                'prevent_repeat': true
            },
            {
                'keys': 'v',
                'on_keydown': _.bind(this.handleKeypressGradingToggle, this),
                'prevent_repeat': true
            },
            {
                'keys': '1',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 1),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 1),
                'prevent_repeat': true
            },
            {
                'keys': '6',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 1),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 1),
                'prevent_repeat': true
            },
            {
                'keys': '2',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 2),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 2),
                'prevent_repeat': true
            },
            {
                'keys': '7',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 2),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 2),
                'prevent_repeat': true
            },
            {
                'keys': '3',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 3),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 3),
                'prevent_repeat': true
            },
            {
                'keys': '8',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 3),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 3),
                'prevent_repeat': true
            },
            {
                'keys': '4',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 4),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 4),
                'prevent_repeat': true
            },
            {
                'keys': '9',
                'on_keydown': _.bind(this.handleKeypressGradingKeydown, this, 4),
                'on_keyup': _.bind(this.handleKeypressGradingKeyup, this, 4),
                'prevent_repeat': true
            }
        ]);
        this.keypressNavigate.register_many([
            {
                'keys': 'enter',
                'on_keydown': _.bind(this.handleKeypressNavigateReveal, this),
                'prevent_repeat': true
            },
            {
                'keys': 'left',
                'on_keydown': _.bind(this.handleKeypressNavigatePrevious, this),
                'prevent_repeat': true
            },
            {
                'keys': 'right',
                'on_keydown': _.bind(this.handleKeypressNavigateNext, this),
                'prevent_repeat': true
            },
            {
                'keys': 'space',
                'on_keydown': _.bind(this.handleKeypressNavigateReveal, this),
                'prevent_repeat': true
            }
        ]);
        this.keypressTone.register_many([
            {
                'keys': '1',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 1),
                'prevent_repeat': true
            },
            {
                'keys': '6',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 1),
                'prevent_repeat': true
            },
            {
                'keys': '2',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 2),
                'prevent_repeat': true
            },
            {
                'keys': '7',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 2),
                'prevent_repeat': true
            },
            {
                'keys': '3',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 3),
                'prevent_repeat': true
            },
            {
                'keys': '8',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 3),
                'prevent_repeat': true
            },
            {
                'keys': '4',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 4),
                'prevent_repeat': true
            },
            {
                'keys': '9',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 4),
                'prevent_repeat': true
            },
            {
                'keys': '5',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 5),
                'prevent_repeat': true
            },
            {
                'keys': '0',
                'on_keydown': _.bind(this.handleKeypressToneKeydown, this, 5),
                'prevent_repeat': true
            }
        ]);
    },
    /**
     * @method remove
     * @returns {Prompt}
     */
    remove: function() {
        this.canvas.remove();
        this.keypressAction.destroy();
        this.keypressGrading.destroy();
        this.keypressNavigate.destroy();
        this.keypressTone.destroy();
        this.toolbarAction.remove();
        this.toolbarGrading.remove();
        this.toolbarVocab.remove();
        this.vocabContained.remove();
        this.vocabDefinition.remove();
        this.vocabMnemonic.remove();
        this.vocabReading.remove();
        this.vocabSentence.remove();
        this.vocabStyle.remove();
        this.vocabWriting.remove();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method reset
     * @returns {Prompt}
     */
    reset: function() {
        this.editing = false;
        this.part = null;
        this.review = null;
        this.reviews = null;
        this.render();
        return this;
    },
    /**
     * @method resize
     * @returns {Prompt}
     */
    resize: function() {
        //TODO: redraw and resize
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {Prompt}
     */
    set: function(reviews) {
        console.info('PROMPT:', reviews.part, reviews.vocab.id, reviews);
        this.part = reviews.part;
        this.reviews = reviews;
        if (!this.loaded) {
            this.loaded = true;
            this.render();
        }
        this.renderPromptLoad();
        this.renderPrompt();
        return this;
    },
    /**
     * @method unregisterKeypress
     */
    unregisterKeypress: function() {
        this.keypressAction.reset();
        this.keypressGrading.reset();
        this.keypressNavigate.reset();
        this.keypressTone.reset();
    }
});
