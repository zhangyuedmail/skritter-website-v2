/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-grading.html',
    'core/modules/GelatoView'
], function(Template, GelatoView) {

    /**
     * @class PromptGrading
     * @extends GelatoView
     */
    var PromptGrading = GelatoView.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.prompt = options.prompt;
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptGrading}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method hide
         * @returns {PromptGrading}
         */
        hide: function() {
            this.$el.hide();
            return this;
        },
        /**
         * @method resize
         * @returns {PromptGrading}
         */
        resize: function() {
            return this;
        },
        /**
         * @method show
         * @returns {PromptGrading}
         */
        show: function() {
            this.$el.show();
            return this;
        }
    });

    return PromptGrading;

});