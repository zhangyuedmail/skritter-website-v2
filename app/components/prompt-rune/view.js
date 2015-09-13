var Prompt = require('components/prompt/view');
var PromptVocabDefinition = require('components/prompt-vocab-definition/view');
var PromptVocabReading = require('components/prompt-vocab-reading/view');
var PromptVocabSentence = require('components/prompt-vocab-sentence/view');
var PromptVocabWriting = require('components/prompt-vocab-writing/view');

/**
 * @class PromptRune
 * @extends {Prompt}
 */
module.exports = Prompt.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.reviews = null;
        this.vocabDefinition = new PromptVocabDefinition();
        this.vocabReading = new PromptVocabReading();
        this.vocabSentence = new PromptVocabSentence();
        this.vocabWriting = new PromptVocabWriting();
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptRune}
     */
    render: function() {
        this.renderTemplate();
        this.vocabDefinition.setElement('#vocab-definition-container').render();
        this.vocabReading.setElement('#vocab-reading-container').render();
        this.vocabSentence.setElement('#vocab-sentence-container').render();
        this.vocabWriting.setElement('#vocab-writing-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {PromptRune}
     */
    remove: function() {
        this.vocabDefinition.remove();
        this.vocabReading.remove();
        this.vocabSentence.remove();
        this.vocabWriting.remove();
        return Prompt.prototype.remove.call(this);
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {PromptRune}
     */
    set: function(reviews) {
        this.reviews = reviews;
        this.vocabDefinition.set(reviews);
        this.vocabReading.set(reviews);
        this.vocabSentence.set(reviews);
        this.vocabWriting.set(reviews);
        this.reviews.unmaskAllReadings();
        return this.render();
    }
});
