define([
    'require.text!template/prompt-rune.html',
    'view/prompt/Canvas',
    'view/prompt/Prompt'
], function(template, Canvas, Prompt) {
    /**
     * @class PromptRune
     */
    var View = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            this.canvas = new Canvas();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            Prompt.prototype.render.call(this);
            this.canvas.setElement('.canvas-container');
            this.canvas.render();
            this.resize();
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = skritter.settings.getCanvasSize();
            var contentHeight = skritter.settings.getContentHeight();
            var contentWidth = skritter.settings.getContentWidth();
            var infoSection, inputSection;
            this.canvas.resize();
            if (skritter.settings.isPortrait()) {
                inputSection = this.$('#input-section').css({
                    height: canvasSize,
                    float: 'none',
                    width: contentWidth
                });
                infoSection = this.$('#info-section').css({
                    height: contentHeight - canvasSize - 20,
                    float: 'none',
                    width: contentWidth
                });
            } else {
                inputSection = this.$('#input-section').css({
                    height: contentHeight - 20,
                    float: 'left',
                    width: canvasSize
                });
                infoSection = this.$('#info-section').css({
                    height: contentHeight - 20,
                    float: 'left',
                    width: contentWidth - canvasSize
                });
            }
        }
    });

    return View;
});