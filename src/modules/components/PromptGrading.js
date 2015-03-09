/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-grading.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class PromptGrading
     * @extends GelatoComponent
     */
    var PromptGrading = GelatoComponent.extend({
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
        events: {}
    });

    return PromptGrading;

});