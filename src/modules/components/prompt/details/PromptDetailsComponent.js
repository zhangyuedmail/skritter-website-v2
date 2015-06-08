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
            this.$('#vocab-writing .value').addClass(vocab.getFontClass());
            this.$('#vocab-writing .value').html(vocab.getWritingElement());
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick #vocab-writing .writing-element': 'handleClickWritingElement'
        },
        /**
         * @method handleClickWritingElement
         * @param {Event} event
         */
        handleClickWritingElement: function(event) {
            event.preventDefault();
            var $element = $(event.currentTarget);
            var position = parseInt($element.data('position'), 10);
            this.prompt.items.position = position;
            this.prompt.renderPrompt();
        },
        /**
         * @method hideDefinition
         */
        hideDefinition: function() {
            this.$('#vocab-definition .value').hide();
        },
        /**
         * @method hideReading
         * @param {Number} [position]
         */
        hideReading: function(position) {
            if (position === undefined) {
                this.$('#vocab-reading .reading-element').addClass('mask');
            } else {
                this.$('#vocab-reading [data-position="' + position + '"]').addClass('mask');
            }
        },
        /**
         * @method hideWriting
         * @param {Number} [position]
         */
        hideWriting: function(position) {
            if (position === undefined) {
                this.$('#writing-reading .writing-element').addClass('mask');
            } else {
                this.$('#writing-reading [data-position="' + position + '"]').addClass('mask');
            }
        },
        /**
         * @method revealDefinition
         */
        revealDefinition: function() {
            this.$('#vocab-definition .value').show();
        },
        /**
         * @method revealReading
         * @param {Number} [position]
         */
        revealReading: function(position) {
            if (position === undefined) {
                this.$('#vocab-reading .reading-element').removeClass('mask');
            } else {
                this.$('#vocab-reading [data-position="' + position + '"]').removeClass('mask');
            }
        },
        /**
         * @method revealWriting
         * @param {Number} [position]
         */
        revealWriting: function(position) {
            if (position === undefined) {
                this.$('#vocab-writing .writing-element').removeClass('mask');
            } else {
                this.$('#vocab-writing [data-position="' + position + '"]').removeClass('mask');
            }
        },
        /**
         * @method selectWriting
         * @param {Number} position
         */
        selectWriting: function(position) {
            this.$('#vocab-writing .writing-element').removeClass('active');
            this.$('#vocab-writing [data-position="' + position + '"]').addClass('active');
        }
    });

    return PromptDetailsComponent;

});