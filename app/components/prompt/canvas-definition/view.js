var GelatoComponent = require('gelato/component');

/**
 * @class PromptCanvasDefinition
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
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
        if (writingLength > 2) {
            this.$('.writing').css('font-size', 75);
        } else if (writingLength > 4) {
            this.$('.writing').css('font-size', 50);
        }
    }
});
