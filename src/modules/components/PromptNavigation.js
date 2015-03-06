/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-navigation.html',
    'core/modules/GelatoView'
], function(Template, GelatoView) {

    /**
     * @class PromptNavigation
     * @extends GelatoView
     */
    var PromptNavigation = GelatoView.extend({
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
            'vclick .navigate-next': 'handleClickNavigateNext',
            'vclick .navigate-previous': 'handleClickNavigatePrevious'
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
        },
        /**
         * @method hide
         * @returns {PromptNavigation}
         */
        hide: function() {
            this.hideNext();
            this.hidePrevious();
            return this;
        },
        /**
         * @method hideNext
         * @returns {PromptNavigation}
         */
        hideNext: function() {
            this.$('.navigate-next').hide();
            return this;
        },
        /**
         * @method hidePrevious
         * @returns {PromptNavigation}
         */
        hidePrevious: function() {
            this.$('.navigate-previous').hide();
            return this;
        },
        /**
         * @method resize
         * @returns {PromptNavigation}
         */
        resize: function() {
            return this;
        },
        /**
         * @method show
         * @returns {PromptNavigation}
         */
        show: function() {
            this.showNext();
            this.showPrevious();
            return this;
        },
        /**
         * @method showNext
         * @returns {PromptNavigation}
         */
        showNext: function() {
            this.$('.navigate-next').show();
            return this;
        },
        /**
         * @method showPrevious
         * @returns {PromptNavigation}
         */
        showPrevious: function() {
            this.$('.navigate-previous').show();
            return this;
        }
    });

    return PromptNavigation;

});