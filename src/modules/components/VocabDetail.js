/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/vocab-detail.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class VocabDetail
     * @extends GelatoComponent
     */
    var VocabDetail = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.vocab = null;
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {VocabDetail}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method renderFields
         * @returns {VocabDetail}
         */
        renderFields: function() {
            var heisig = this.vocab.getHeisig();
            var mnemonic = this.vocab.getMnemonic();
            var sentence = this.vocab.getSentence();
            this.$('.vocab-definition').html(this.vocab.getDefinition());
            this.$('.vocab-reading').text(this.vocab.getReading());
            this.$('.vocab-difficulty').text(this.vocab.get('toughnessString'));
            this.$('.vocab-writing').text(this.vocab.get('writing'));
            if (heisig) {
                this.$('.vocab-heisig').text(heisig);
            } else {
                this.$('.vocab-heisig').parent().hide();
            }
            if (mnemonic) {
                this.$('.vocab-mnemonic').text(mnemonic);
            } else {
                this.$('.vocab-mnemonic').parent().hide();
            }
            if (sentence) {
                this.$('.vocab-sentence').text(sentence);
            } else {
                this.$('.vocab-sentence').parent().hide();
            }
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method set
         * @param {DataVocab} vocab
         * @returns {VocabDetail}
         */
        set: function(vocab) {
            this.vocab = vocab;
            this.renderFields();
            return this;
        }
    });

    return VocabDetail;

});