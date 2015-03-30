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
            this.on('resize', this.resize);
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
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method resize
         * @returns {PromptDetail}
         */
        resize: function() {
            return this;
        }
    });

    return PromptDetail;

});