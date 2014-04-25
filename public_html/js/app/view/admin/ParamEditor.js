/**
 * @module Skritter
 * @submodule View
 * @param templateParamEditor
 * @param PromptCanvas
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'require.text!template/admin-param-editor.html',
    'view/prompt/Canvas',
    'model/prompt/Stroke'
], function(templateParamEditor, PromptCanvas, Stroke) {
    /**
     * @class AdminParamEditor
     */
    var ParamEditor = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.canvas = new PromptCanvas();
            this.stroke = null;
            this.strokeId = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateParamEditor);
            this.canvas.setElement(this.$('#writing-area'));
            this.listenTo(skritter.settings, 'resize', this.resize);
            this.listenTo(this.canvas, 'input:up', _.bind(this.handleStrokeReceived, this));
            this.resize();
            this.canvas.drawShape('background', this.stroke);
            this.canvas.enableInput();
            return this;
        },
        /**
         * @method handleStrokeReceived
         * @param {Array} points
         */
        handleStrokeReceived: function(points) {
            var stroke = new Stroke().set('points', points);
            var param = {
                bitmapId: parseInt(this.strokeId, 10),
                corners: stroke.get('corners'),
                deviations: stroke.getLineDeviations()
            };
            console.log('Param ', param.bitmapId, ' created with ', param.corners.length, ' corners.');
            console.log(JSON.stringify(param));
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
            
        },
        /**
         * @method setStrokeId
         * @param {type} strokeId
         * @returns {Backbone.View}
         */
        setStrokeId: function(strokeId) {
            this.stroke = skritter.assets.getStroke(strokeId, 'grey');
            this.strokeId = strokeId;
            return this;
        }
    });
    
    return ParamEditor;
});