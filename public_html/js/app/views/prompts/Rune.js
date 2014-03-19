/**
 * @module Skritter
 * @submodule Views
 * @param templateRune
 * @param Canvas
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-rune.html',
    'views/prompts/Canvas',
    'views/prompts/Prompt'
], function(templateRune, Canvas, Prompt) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Rune.canvas = new Canvas();
            this.listenTo(Rune.canvas, 'input:up', this.handleStrokeReceived);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Prompt.prototype.render.call(this);
            Rune.canvas.setElement(this.$('#writing-area')).render();
            Rune.canvas.enableInput();
            this.$('#prompt-definition').html(this.review.vocab().get('definitions').en);
            this.$('#prompt-reading').html(this.review.vocab().reading());
            this.$('#prompt-writing').html(this.review.vocab().writingBlocks(1));
            this.resize();
            return this;
        },
        /**
         * @method handleStrokeReceived
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        handleStrokeReceived: function(points, shape) {
            var result = this.review.characters[0].recognize(points, shape);
            if (result) {
                Rune.canvas.tweenShape('display', result.userShape(), result.inflateShape());
                if (this.review.characters[0].isFinished()) {
                    Rune.canvas.disableInput();
                    Rune.canvas.injectLayerColor('display', skritter.settings.get('gradingColors')[3]);
                    Prompt.gradingButtons.show();
                }
            }
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            Rune.canvas.render();
            Rune.canvas.resize(skritter.settings.canvasSize());
            this.$('#top-container').height(skritter.settings.contentHeight() - skritter.settings.canvasSize() - 3);
            this.$('#top-container').width(skritter.settings.contentWidth());
            this.$('#bottom-container').height(skritter.settings.contentHeight() - this.$('#top-container').height() - 3);
            this.$('#bottom-container').width(skritter.settings.contentWidth());
        }
    });

    return Rune;
});