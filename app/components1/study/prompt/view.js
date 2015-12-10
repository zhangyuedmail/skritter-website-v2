var GelatoComponent = require('gelato/component');

var Canvas = require('components1/study/prompt/canvas/view');
var PartDefn = require('components1/study/prompt/part-defn/view');
var PartRdng = require('components1/study/prompt/part-rdng/view');
var PartRune = require('components1/study/prompt/part-rune/view');
var PartTone = require('components1/study/prompt/part-tone/view');
var ToolbarAction = require('components1/study/prompt/toolbar-action/view');
var ToolbarGrading = require('components1/study/prompt/toolbar-grading/view');
var VocabDefinition = require('components1/study/prompt/vocab-definition/view');
var VocabReading = require('components1/study/prompt/vocab-reading/view');
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
        this.$inputContainer = null;
        this.$panelLeft = null;
        this.$panelRight = null;
        this.review = null;
        this.canvas = new Canvas({prompt: this});
        this.toolbarAction = new ToolbarAction({prompt: this});
        this.toolbarGrading = new ToolbarGrading({prompt: this});
        this.vocabDefinition = new VocabDefinition({prompt: this});
        this.vocabReading = new VocabReading({prompt: this});
        this.vocabStyle = new VocabStyle({prompt: this});
        this.vocabWriting = new VocabWriting({prompt: this});
        this.review = null;
        this.reviews = null;
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
        this.vocabDefinition.setElement('#vocab-definition-container').render();
        this.vocabReading.setElement('#vocab-reading-container').render();
        this.vocabStyle.setElement('#vocab-style-container').render();
        this.vocabWriting.setElement('#vocab-writing-container').render();
        this.resize();
        return this;
    },
    /**
     * @method renderPrompt
     * @returns {StudyPrompt}
     */
    renderPrompt: function() {
        if (this.part) {
            this.part.remove();
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
     * @method remove
     * @returns {StudyPrompt}
     */
    remove: function() {
        this.canvas.remove();
        this.toolbarAction.remove();
        this.toolbarGrading.remove();
        this.vocabDefinition.remove();
        this.vocabReading.remove();
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
        this.renderPrompt();
        return this;
    }
});
