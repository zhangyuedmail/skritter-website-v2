var GelatoComponent = require('gelato/component');

var Prompt = require('components/prompt/view');
var PromptActionToolbar = require('components/prompt/action-toolbar/view');
var PromptGradingToolbar = require('components/prompt/grading-toolbar/view');
var PromptCanvas = require('components/prompt/canvas/view');
var PromptVocabDefinition = require('components/prompt/vocab-definition/view');
var PromptVocabMnemonic = require('components/prompt/vocab-mnemonic/view');
var PromptVocabReading = require('components/prompt/vocab-reading/view');
var PromptVocabSentence = require('components/prompt/vocab-sentence/view');
var PromptVocabWriting = require('components/prompt/vocab-writing/view');

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
        this.part = null;
        this.reviews = null;
        this.actionToolbar = new PromptActionToolbar({prompt: this});
        this.canvas = new PromptCanvas({prompt: this});
        this.gradingToolbar = new PromptGradingToolbar({prompt: this});
        this.vocabDefinition = new PromptVocabDefinition({prompt: this});
        this.vocabMnemonic = new PromptVocabMnemonic({prompt: this});
        this.vocabReading = new PromptVocabReading({prompt: this});
        this.vocabSentence = new PromptVocabSentence({prompt: this});
        this.vocabWriting = new PromptVocabWriting({prompt: this});

        //this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
        //this.listenTo(this.canvas, 'canvas:swipeup', this.handleCanvasSwipeUp);
        //this.listenTo(this.inputCanvas, 'input:up', this.handleCanvasInputUp);
        //this.listenTo(this.canvas, 'navigate:left', this.handleNavigateLeft);
        //this.listenTo(this.canvas, 'navigate:right', this.handleNavigateRight);
        //this.listenTo(this.grading, 'mousedown', this.handleHighlightGrading);
        //this.listenTo(this.grading, 'change', this.handleChangeGrading);
        //this.listenTo(this.grading, 'select', this.handleSelectGrading);
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
        return this;
    },
    /**
     * @method renderPrompt
     * @returns {Prompt}
     */
    renderPrompt: function() {
        return this;
    },
    /**
     * @method renderPromptInitialize
     * @returns {Prompt}
     */
    renderPromptInitialize: function() {
        this.render();
        this.actionToolbar.setElement('#action-toolbar-container').render();
        this.canvas.setElement('#canvas-container').render();
        this.gradingToolbar.setElement('#grading-toolbar-container').render();
        this.vocabDefinition.setElement('#vocab-definition-container').render();
        this.vocabMnemonic.setElement('#vocab-mnemonic-container').render();
        this.vocabReading.setElement('#vocab-reading-container').render();
        this.vocabSentence.setElement('#vocab-sentence-container').render();
        this.vocabWriting.setElement('#vocab-writing-container').render();
        this.reset();
        return this;
    },
    /**
     * @method remove
     * @returns {Prompt}
     */
    remove: function() {
        this.actionToolbar.remove();
        this.canvas.remove();
        this.gradingToolbar.remove();
        this.vocabDefinition.remove();
        this.vocabMnemonic.remove();
        this.vocabReading.remove();
        this.vocabSentence.remove();
        this.vocabWriting.remove();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method reset
     * @returns {Prompt}
     */
    reset: function() {
        return this;
    },
    /**
     * @method set
     * @param {String} part
     * @param {PromptReviews} reviews
     * @returns {Prompt}
     */
    set: function(part, reviews) {
        console.info('PROMPT:', part, reviews.vocab.id, reviews);
        this.part = part;
        this.reviews = reviews;
        this.renderPromptInitialize();
        this.renderPrompt();
        return this;
    }
});
