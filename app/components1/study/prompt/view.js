var GelatoComponent = require('gelato/component');

var Canvas = require('components1/study/prompt/canvas/view');
var PartDefn = require('components1/study/prompt/part-defn/view');
var PartRdng = require('components1/study/prompt/part-rdng/view');
var PartRune = require('components1/study/prompt/part-rune/view');
var PartTone = require('components1/study/prompt/part-tone/view');
var Shortcuts = require('components1/study/prompt/shortcuts');
var ToolbarAction = require('components1/study/prompt/toolbar-action/view');
var ToolbarGrading = require('components1/study/prompt/toolbar-grading/view');
var ToolbarVocab = require('components1/study/prompt/toolbar-vocab/view');
var VocabContained = require('components1/study/prompt/vocab-contained/view');
var VocabDefinition = require('components1/study/prompt/vocab-definition/view');
var VocabMnemonic = require('components1/study/prompt/vocab-mnemonic/view');
var VocabReading = require('components1/study/prompt/vocab-reading/view');
var VocabSentence = require('components1/study/prompt/vocab-sentence/view');
var VocabStyle = require('components1/study/prompt/vocab-style/view');
var VocabWriting = require('components1/study/prompt/vocab-writing/view');

/**
 * @class StudyPrompt
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        //properties
        this.$inputContainer = null;
        this.$panelLeft = null;
        this.$panelRight = null;
        this.review = null;
        this.reviews = null;
        //components
        this.canvas = new Canvas({prompt: this});
        this.shortcuts = new Shortcuts({prompt: this});
        this.toolbarAction = new ToolbarAction({prompt: this});
        this.toolbarGrading = new ToolbarGrading({prompt: this});
        this.toolbarVocab = new ToolbarVocab({prompt: this});
        this.vocabContained = new VocabContained({prompt: this});
        this.vocabDefinition = new VocabDefinition({prompt: this});
        this.vocabMnemonic = new VocabMnemonic({prompt: this});
        this.vocabReading = new VocabReading({prompt: this});
        this.vocabSentence = new VocabSentence({prompt: this});
        this.vocabStyle = new VocabStyle({prompt: this});
        this.vocabWriting = new VocabWriting({prompt: this});
        this.on('resize', this.resize);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPrompt}
     */
    render: function() {
        this.renderTemplate();
        this.$inputContainer = this.$('#input-container');
        this.$panelLeft = this.$('#panel-left');
        this.$panelRight = this.$('#panel-right');
        this.canvas.setElement('#canvas-container').render();
        this.toolbarAction.setElement('#toolbar-action-container').render();
        this.toolbarGrading.setElement('#toolbar-grading-container').render();
        this.toolbarVocab.setElement('#toolbar-vocab-container').render();
        this.vocabContained.setElement('#vocab-contained-container').render();
        this.vocabDefinition.setElement('#vocab-definition-container').render();
        this.vocabMnemonic.setElement('#vocab-mnemonic-container').render();
        this.vocabReading.setElement('#vocab-reading-container').render();
        this.vocabSentence.setElement('#vocab-sentence-container').render();
        this.vocabStyle.setElement('#vocab-style-container').render();
        this.vocabWriting.setElement('#vocab-writing-container').render();
        this.shortcuts.registerAll();
        this.resize();
        return this;
    },
    /**
     * @method renderPart
     * @returns {StudyPrompt}
     */
    renderPart: function() {
        if (this.part) {
            this.part.remove();
        }
        if (this.reviews.isNew()) {
            this.$('#new-ribbon').removeClass('hidden');
        } else {
            this.$('#new-ribbon').addClass('hidden');
        }
        switch (this.reviews.part) {
            case 'defn':
                this.part = new PartDefn({prompt: this}).render();
                break;
            case 'rdng':
                this.part = new PartRdng({prompt: this}).render();
                break;
            case 'rune':
                this.part = new PartRune({prompt: this}).render();
                break;
            case 'tone':
                this.part = new PartTone({prompt: this}).render();
                break;
        }
        return this;
    },
    /**
     * @method getInputSize
     * @returns {Number}
     */
    getInputSize: function() {
        var $content = this.$panelLeft.find('.content');
        if ($content.length) {
            return $content.width();
        } else {
            return 0;
        }
    },
    /**
     * @method next
     */
    next: function() {
        if (this.reviews.isLast()) {
            this.trigger('next', this.reviews);
        } else {
            this.reviews.next();
            this.trigger('reviews:next', this.reviews);
            this.renderPart();
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
            this.trigger('reviews:previous', this.reviews);
            this.renderPart();
        }
    },
    /**
     * @method remove
     * @returns {StudyPrompt}
     */
    remove: function() {
        this.canvas.remove();
        this.shortcuts.unregisterAll();
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
     * @returns {StudyPrompt}
     */
    reset: function() {
        return this;
    },
    /**
     * @method resize
     * @returns {StudyPrompt}
     */
    resize: function() {
        var inputSize = this.getInputSize();
        this.$inputContainer.css({height: inputSize, width: inputSize});
        this.canvas.resize();
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {StudyPrompt}
     */
    set: function(reviews) {
        console.info('PROMPT:', reviews);
        this.reviews = reviews;
        this.renderPart();
        return this;
    }
});
