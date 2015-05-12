/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-detail.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class PromptDetail
     * @extends GelatoComponent
     */
    var PromptDetail = GelatoComponent.extend({
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
         * @returns {PromptDetail}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderFields
         * @returns {PromptDetail}
         */
        renderFields: function() {
            var vocab = this.prompt.active().getVocab();
            this.$('#vocab-definition-value').html(vocab.getDefinition());
            this.$('#vocab-reading-value').html(vocab.getReadingElement());
            this.$('#vocab-style-value').text(vocab.getStyle());
            this.$('#vocab-writing-value').html(vocab.getWritingElement());
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {}
    });

    return PromptDetail;

});