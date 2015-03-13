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
            if (this.prompt.vocab.isChinese()) {
                this.$('.vocab-reading').addClass('text-pinyin');
                this.$('.vocab-writing').addClass('text-chinese');
            }
            if (this.prompt.vocab.isJapanese()) {
                this.$('.vocab-writing').addClass('text-japanese');
            }
            this.$('.vocab-definition').html(this.prompt.vocab.getDefinition());
            this.$('.vocab-reading').html(this.prompt.vocab.getReadingElement());
            this.$('.vocab-style').html(this.prompt.vocab.get('style'));
            this.$('.vocab-writing').html(this.prompt.vocab.getWritingElement());
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .vocab-writing > div': 'handleClickVocabWriting'
        },
        /**
         * @method handleClickVocabWriting
         * @param {Event} event
         */
        handleClickVocabWriting: function(event) {
            event.preventDefault();
            var target = event.currentTarget;
            if (this.prompt.part === 'rune') {
                var position = parseInt(target.id.replace('writing-position-', ''), 10);
                if (position !== this.prompt.position) {
                    this.prompt.position = position;
                    this.prompt.renderPrompt();
                }
            }
            if (this.prompt.part === 'tone') {}
        },
        /**
         * @method hideCharacters
         * @returns {PromptDetail}
         */
        hideCharacters: function() {
            if (this.prompt.part === 'rune') {
                this.$('#writing-position-' + this.prompt.position).addClass('mask');
            } else {
                this.$('.vocab-writing > div').addClass('mask');
            }
            return this;
        },
        /**
         * @method hideReading
         * @param {Object} [options]
         * @returns {PromptDetail}
         */
        hideReading: function(options) {
            options = options || {};
            if (this.prompt.part === 'rdng') {
                this.$('#reading-position-' + this.prompt.position).addClass('mask');
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
        selectCharacter: function() {
            this.$('.vocab-writing > div').removeClass('active');
            this.$('#writing-position-' + this.prompt.position).addClass('active');
            return this;
        },
        /**
         * @method showCharacters
         * @returns {PromptDetail}
         */
        showCharacters: function() {
            if (this.prompt.part === 'rune') {
                this.$('#writing-position-' + this.prompt.position).removeClass('mask');
            } else {
                this.$('.vocab-writing > div').removeClass('mask');
            }
            return this;
        },
        /**
         * @method showReading
         * @param {Object} [options]
         * @returns {PromptDetail}
         */
        showReading: function(options) {
            options = options || {};
            if (this.prompt.part === 'rdng') {
                this.$('#reading-position-' + this.prompt.position).removeClass('mask');
            } else {
                this.$('.vocab-reading > div').removeClass('mask');
            }
        }
    });

    return PromptDetail;

});