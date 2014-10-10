/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/admin/param-editor.html',
    'prompts/PromptCanvas'
], function(BasePage, TemplateMobile, PromptCanvas) {
    /**
     * @class ParamEditor
     * @extends BasePage
     */
    var ParamEditor = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Param Editor';
            this.canvas = new PromptCanvas();
            this.strokeId = 0;
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {ParamEditor}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.canvas.setElement(this.$('.canvas-container')).render();
            this.elements.canvasContainer = this.$('.canvas-container');
            this.elements.detailContainer = this.$('.detail-container');
            this.elements.paramOutput = this.$('#param-output');
            this.renderElements().resize();
            this.canvas.hideGrid().show().enableInput();
            this.listenTo(this.canvas, 'input:down', this.handleInputDown);
            this.listenTo(this.canvas, 'input:up', this.handleInputUp);
            this.loadStroke();
            return this;
        },
        /**
         * @method renderElements
         * @returns {ParamEditor}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-clear': 'handleClearButtonClicked'
        }),
        /**
         * @method handleClearButtonClicked
         * @param {Event} event
         */
        handleClearButtonClicked: function(event) {
            event.preventDefault();
            this.elements.paramOutput.val('');
            this.canvas.clearAll();
            this.loadStroke();
        },
        /**
         * @method handleInputDown
         */
        handleInputDown: function() {
            this.elements.paramOutput.val('');
            this.canvas.clearAll();
            this.loadStroke();
        },
        /**
         * @method handleInputUp
         * @param {Array} points
         */
        handleInputUp: function(points) {
            var param = {};
            var corners = app.fn.shortstraw.process(points);
            for (var i = 0, length = corners.length; i < length; i++) {
                var corner = corners[i];
                corner.x = Math.round(corner.x);
                corner.y = Math.round(corner.y);
                this.canvas.drawCircle('stroke', corner.x, corner.y, 10, {fill: 'red'});
            }
            param.strokeId = this.strokeId;
            param.corners = corners;
            this.elements.paramOutput.val(JSON.stringify(param));
            this.elements.paramOutput.select();
        },
        /**
         * @method loadStroke
         * @return {ParamEditor}
         */
        loadStroke: function() {
            var stroke = app.assets.getStroke(this.strokeId);
            this.canvas.drawShape('background', stroke, {color: 'grey'});
            return this;
        },
        /**
         * @method resize
         * @returns {ParamEditor}
         */
        resize: function() {
            var contentHeight = this.getContentHeight();
            var contentWidth = this.getContentWidth();
            if (app.isPortrait()) {
                this.canvas.resize(contentWidth);
                this.elements.detailContainer.height();
                this.elements.detailContainer.css({
                    height: contentHeight - contentWidth,
                    width: contentWidth
                });
            } else {
                this.canvas.resize(contentHeight);
                this.elements.detailContainer.css({
                    height: this.canvas.getWidth(),
                    width: contentWidth - this.canvas.getWidth()
                });
            }
            return this;
        },
        /**
         * @method set
         * @param {String} strokeId
         * @returns {ParamEditor}
         */
        set: function(strokeId) {
            this.strokeId = strokeId === null ? 0 : parseInt(strokeId, 10);
            return this;
        }
    });

    return ParamEditor;
});
