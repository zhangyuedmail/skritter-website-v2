/**
 * @module Skritter
 * @submodule View
 * @param templateStrokeEditor
 * @param PromptCanvas
 * @author Joshua McFarland
 */
define([
    'require.text!template/admin-stroke-editor.html',
    'view/prompt/Canvas'
], function(templateStrokeEditor, PromptCanvas) {
    /**
     * @class AdminStrokeEditor
     */
    var StrokeEditor = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.canvas = new PromptCanvas();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStrokeEditor);
            this.canvas.setElement(this.$('#writing-area'));
            this.listenTo(skritter.settings, 'resize', this.resize);
            this.resize();
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method resize
         */
        resize: function() {
            var canvasSize = skritter.settings.canvasSize();
            this.canvas.resize(canvasSize).render();
        }
    });
    
    return StrokeEditor;
});