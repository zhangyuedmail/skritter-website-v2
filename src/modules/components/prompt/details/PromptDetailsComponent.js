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
            var vocab = this.prompt.items.getVocab();
            this.$('#vocab-definition .value').html(vocab.getDefinition());
            this.$('#vocab-reading .value').html(vocab.getReadingElement());
            this.$('#vocab-style .value').html(vocab.getStyle());
            this.$('#vocab-writing .value').html(vocab.getWritingElement());
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