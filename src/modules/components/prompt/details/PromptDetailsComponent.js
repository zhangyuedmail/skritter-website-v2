/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!modules/components/prompt/details/prompt-details-template.html',
    'core/modules/GelatoComponent'
], function(
    Template,
    GelatoComponent
) {

    /**
     * @class PromptDetailsComponent
     * @extends GelatoComponent
     */
    var PromptDetailsComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.prompt = options.prompt;
        },
        /**
         * @method render
         * @returns {PromptDetailsComponent}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderFields
         * @returns {PromptDetailsComponent}
         */
        renderFields: function() {
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {}
    });

    return PromptDetailsComponent;

});