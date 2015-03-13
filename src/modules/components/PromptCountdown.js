/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-countdown.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class PromptCountdown
     * @extends GelatoComponent
     */
    var PromptCountdown = GelatoComponent.extend({
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
         * @returns {PromptCountdown}
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
         * @method setRemaining
         * @param {Number} number
         * @returns {PromptCountdown}
         */
        setRemaining: function(number) {
            this.$('.remaining').text(number);
            return this;
        }
    });

    return PromptCountdown;

});