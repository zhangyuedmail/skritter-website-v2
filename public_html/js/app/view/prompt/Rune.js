define([
    'require.text!template/prompt-rune.html',
    'view/prompt/Prompt'
], function(template, Prompt) {
    /**
     * @class PromptRune
     */
    var View = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            Prompt.prototype.render.call(this);
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
            if (skritter.settings.isPortrait()) {
                inputSection = this.$('#input-section').css({
                    height: canvasSize - 10,
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