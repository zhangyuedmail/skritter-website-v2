/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-detail.html',
    'core/modules/GelatoView'
], function(Template, GelatoView) {

    /**
     * @class PromptDetail
     * @extends GelatoView
     */
    var PromptDetail = GelatoView.extend({
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
            this.$('.vocab-reading').html(this.prompt.vocab.getReading());
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
            var position = parseInt(target.id.replace('writing-position-', ''), 10);
            if (position !== this.prompt.position) {
                this.prompt.position = position;
                this.prompt.renderCharacter();
            }
        },
        /**
         * @method hide
         * @returns {PromptDetail}
         */
        hide: function() {
            this.$el.hide();
            return this;
        },
        /**
         * @method hideCharacter
         * @returns {PromptDetail}
         */
        hideCharacter: function() {
            this.$('#writing-position-' + this.prompt.position).addClass('mask');
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
         * @method show
         * @returns {PromptDetail}
         */
        show: function() {
            this.$el.show();
            return this;
        },
        /**
         * @method showCharacter
         * @returns {PromptDetail}
         */
        showCharacter: function() {
            this.$('#writing-position-' + this.prompt.position).removeClass('mask');
            return this;
        }
    });

    return PromptDetail;

});