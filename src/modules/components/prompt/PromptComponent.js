/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!modules/components/prompt/prompt-template.html',
    'core/modules/GelatoComponent',
    'modules/components/prompt/canvas/PromptCanvasComponent'
], function(
    Template,
    GelatoComponent,
    PromptCanvasComponent
) {

    /**
     * @class PromptComponent
     * @extends GelatoComponent
     */
    var PromptComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.canvas = new PromptCanvasComponent();
            this.detail = null;
            this.grading = null;
            this.toolbar = null;
            this.items = null;
            this.position = 0;
            this.teaching = false;
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptComponent}
         */
        render: function() {
            this.renderTemplate(Template);
            this.canvas.setElement('#prompt-canvas-container').render();
            this.resize();
            return this;
        },
        /**
         * @method getActive
         * @returns {PromptComponentItem}
         */
        getActive: function() {
            return this.items.at(this.position);
        },
        /**
         * @method getCharacter
         * @returns {CanvasCharacter}
         */
        getCharacter: function() {
            return this.active().get('character');
        },
        /**
         * @method remove
         * @returns {GelatoView}
         */
        remove: function() {
            this.canvas.remove();
            this.detail.remove();
            this.grading.remove();
            this.toolbar.remove();
            return GelatoComponent.prototype.remove.call(this);
        },
        /**
         * @method resize
         * @returns {PromptComponent}
         */
        resize: function() {
            var panelLeft = this.$('#panel-left');
            var panelRight = this.$('#panel-right');
            return this;
        },
        /**
         * @method set
         * @param {PromptItems} items
         * @param {Object} [options]
         * @returns {PromptComponent}
         */
        set: function(items, options) {
            console.log('PROMPT:', items);
            options = options || {};
            this.resize();
            return this;
        }
    });

    return PromptComponent;

});