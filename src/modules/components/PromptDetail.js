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
            var vocab = this.prompt.vocab;
            this.$('.vocab-definition').html(vocab.getDefinition());
            this.$('.vocab-reading').html(vocab.getReadingElement());
            this.$('.vocab-style').text(vocab.getStyle());
            this.$('.vocab-writing').html(vocab.getWritingElement());
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method hideCharacters
         * @param {Number} [position]
         * @returns {PromptDetail}
         */
        hideCharacters: function(position) {
            if (position) {
                this.$('#writing-position-' + position).addClass('mask');
            } else {
                this.$('.vocab-writing > div').addClass('mask');
            }
            return this;
        },
        /**
         * @method hideReading
         * @param {Number} [position]
         * @returns {PromptDetail}
         */
        hideReading: function(position) {
            if (position) {
                this.$('#reading-position-' + position).addClass('mask');
            } else {
                this.$('.vocab-reading > div').addClass('mask');
            }
            return this;
        },
        /**
         * @method resize
         * @returns {PromptDetail}
         */
        resize: function() {
            return this;
        },
        /**
         * @method selectCharacter
         * @returns {PromptDetail}
         */
        selectCharacter: function(position) {
            this.$('.vocab-writing > div').removeClass('active');
            if (position) {
                this.$('#writing-position-' + position).addClass('active');
            }
            return this;
        },
        /**
         * @method selectReading
         * @returns {PromptDetail}
         */
        selectReading: function(position) {
            this.$('.vocab-reading > div').removeClass('active');
            if (position) {
                this.$('#reading-position-' + position).addClass('active');
            }
            return this;
        },
        /**
         * @method showCharacters
         * @param {Number} [position]
         * @returns {PromptDetail}
         */
        showCharacters: function(position) {
            if (position) {
                this.$('#writing-position-' + position).removeClass('mask');
            } else {
                this.$('.vocab-writing > div').removeClass('mask');
            }
            return this;
        },
        /**
         * @method showReading
         * @param {Number} [position]
         * @returns {PromptDetail}
         */
        showReading: function(position) {
            if (position) {
                this.$('#reading-position-' + position).removeClass('mask');
            } else {
                this.$('.vocab-reading > div').removeClass('mask');
            }
        }
    });

    return PromptDetail;

});