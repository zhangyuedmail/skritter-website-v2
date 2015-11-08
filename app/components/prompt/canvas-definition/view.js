var Component = require('base/component');

/**
 * @class PromptCanvasDefinition
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.prompt = options.prompt;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptCanvasDefinition}
     */
    render: function() {
        this.renderTemplate();
        if (this.prompt.review) {
            this.resizeText();
        }
        return this;
    },
    /**
     * @method resizeText
     */
    resizeText: function() {
        var vocab = this.prompt.review.vocab;
        var writingLength = vocab.get('writing').length;
        if (writingLength > 6) {
            this.$('.writing').css('font-size', 40);
        } else if (writingLength > 3) {
            this.$('.writing').css('font-size', 50);
        } else {
            this.$('.writing').css('font-size', 75);
        }
    }
});
