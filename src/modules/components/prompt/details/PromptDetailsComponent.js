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
            this.$('#vocab-definition .value').html(this.prompt.reviews.vocab.getDefinition());
            this.$('#vocab-mnemonic .value').html(this.prompt.reviews.vocab.getMnemonicText());
            this.$('#vocab-reading .value').html(this.prompt.reviews.vocab.getReadingElement());
            this.$('#vocab-sentence .value').html(this.prompt.reviews.vocab.getSentenceWriting());
            this.$('#vocab-style .value').html(this.prompt.reviews.vocab.getStyle());
            this.$('#vocab-writing .value').addClass(this.prompt.reviews.vocab.getFontClass());
            this.$('#vocab-writing .value').html(this.prompt.reviews.vocab.getWritingElement());
            this.updateDetailBanned();
            this.updateDetailStarred();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick #button-detail-audio': 'handleClickDetailAudio',
            'vclick #button-detail-ban': 'handleClickDetailBan',
            'vclick #button-detail-edit': 'handleClickDetailEdit',
            'vclick #button-detail-info': 'handleClickDetailInfo',
            'vclick #button-detail-star': 'handleClickDetailStar',
            'vclick #vocab-writing .writing-element': 'handleClickWritingElement'
        },
        /**
         * @method handleClickDetailAudio
         * @param {Event} event
         */
        handleClickDetailAudio: function(event) {
            event.preventDefault();
            this.prompt.reviews.vocab.play();
        },
        /**
         * @method handleClickDetailBan
         * @param {Event} event
         */
        handleClickDetailBan: function(event) {
            event.preventDefault();
            this.prompt.reviews.vocab.toggleBanned();
            this.updateDetailBanned();
        },
        /**
         * @method handleClickDetailEdit
         * @param {Event} event
         */
        handleClickDetailEdit: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickDetailInfo
         * @param {Event} event
         */
        handleClickDetailInfo: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickDetailStar
         * @param {Event} event
         */
        handleClickDetailStar: function(event) {
            event.preventDefault();
            this.prompt.reviews.vocab.toggleStarred();
            this.updateDetailStarred();
        },
        /**
         * @method handleClickWritingElement
         * @param {Event} event
         */
        handleClickWritingElement: function(event) {
            event.preventDefault();
            var $element = $(event.currentTarget);
            this.prompt.reviews.position = parseInt($element.data('position'), 10);
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
            if (position !== undefined) {
                this.$('#vocab-reading .segment[data-segment="' + position + '"]').addClass('mask');
            } else {
                this.$('#vocab-reading .segment').addClass('mask');
            }
        },
        /**
         * @method hideReadingTone
         * @param {Number} [position]
         */
        hideReadingTone: function(position) {
            if (position !== undefined) {
                this.$('#vocab-reading .segment[data-segment="' + position + '"] .raw').removeClass('hidden');
                this.$('#vocab-reading .segment[data-segment="' + position + '"] .tone').addClass('hidden');
            } else {
                this.$('#vocab-reading .segment .raw').removeClass('hidden');
                this.$('#vocab-reading .segment .tone').addClass('hidden');
            }
        },
        /**
         * @method hideWriting
         * @param {Number} [position]
         */
        hideWriting: function(position) {
            if (position !== undefined) {
                this.$('#writing-reading [data-position="' + position + '"]').addClass('mask');
            } else {
                this.$('#writing-reading .writing-element').addClass('mask');
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
            if (position !== undefined) {
                this.$('#vocab-reading .segment[data-segment="' + position + '"]').removeClass('mask');
            } else {
                this.$('#vocab-reading .segment').removeClass('mask');
            }
        },
        /**
         * @method revealReadingTone
         * @param {Number} [position]
         */
        revealReadingTone: function(position) {
            if (position !== undefined) {
                this.$('#vocab-reading .segment[data-segment="' + position + '"] .raw').addClass('hidden');
                this.$('#vocab-reading .segment[data-segment="' + position + '"] .tone').removeClass('hidden');
            } else {
                this.$('#vocab-reading .segment .raw').addClass('hidden');
                this.$('#vocab-reading .segment .tone').removeClass('hidden');
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
        },
        /**
         * @method updateDetailBanned
         */
        updateDetailBanned: function() {
            if (this.prompt.reviews.vocab.isBanned()) {
                this.$('#button-detail-ban').css('background-color', 'red');
            } else {
                this.$('#button-detail-ban').css('background-color', '');
            }
        },
        /**
         * @method updateDetailStarred
         */
        updateDetailStarred: function() {
            if (this.prompt.reviews.vocab.isStarred()) {
                this.$('#button-detail-star').css('background-color', 'yellow');
            } else {
                this.$('#button-detail-star').css('background-color', '');
            }
        }
    });

    return PromptDetailsComponent;

});