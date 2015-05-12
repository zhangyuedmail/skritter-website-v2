/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-navigation.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class PromptNavigation
     * @extends GelatoComponent
     */
    var PromptNavigation = GelatoComponent.extend({
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
         * @returns {PromptNavigation}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick #navigate-next': 'handleClickNavigateNext',
            'vclick #navigate-previous': 'handleClickNavigatePrevious'
        },
        /**
         * @method handleClickNavigateNext
         * @param {Event} event
         */
        handleClickNavigateNext: function(event) {
            event.preventDefault();
            this.prompt.next();
        },
        /**
         * @method handleClickNavigatePrevious
         * @param {Event} event
         */
        handleClickNavigatePrevious: function(event) {
            event.preventDefault();
            this.prompt.previous();
        }
    });

    return PromptNavigation;

});