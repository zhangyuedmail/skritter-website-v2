/**
 * @module Application
 * @submodule Components
 */
define([
    'core/modules/GelatoComponent',
    'require.text!modules/components/word/details/word-details-template.html',
    'modules/components/word/dictionary/WordDictionaryComponent'
], function(
    GelatoComponent,
    Template,
    WordDictionaryComponent
) {

    /**
     * @class WordDetailsComponent
     * @extends GelatoComponent
     */
    var WordDetailsComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.dictionary = new WordDictionaryComponent();
            this.vocab = null;
        },
        /**
         * @method render
         * @returns {WordDetailsComponent}
         */
        render: function() {
            this.hide().renderTemplate(Template);
            this.dictionary.setElement(this.$('#vocab-dictionary .value')).render();
            return this;
        },
        /**
         * @method renderFields
         * @returns {WordDetailsComponent}
         */
        renderFields: function() {
            this.$('#vocab-definition .value').html(this.vocab.getDefinition());
            this.$('#vocab-mnemonic .value').html(this.vocab.getMnemonicText());
            this.$('#vocab-sentence .value').html(this.vocab.getSentenceWriting());
            this.$('#vocab-writing-primary .value').html(this.vocab.get('writing'));
            this.$('#vocab-reading .value').html(this.vocab.getReading());
            if (this.vocab.getHeisig()) {
                this.$('#vocab-heisig .value').html(this.vocab.getHeisig());
                this.$('#vocab-heisig .value').parent().show();
            } else {
                this.$('#vocab-heisig .value').parent().hide();
            }
            this.dictionary.set(this.vocab.get('dictionaryLinks'));
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method load
         * @param {String} vocabId
         * @returns {WordDetailsComponent}
         */
        load: function(vocabId) {
            var self = this;
            app.user.data.vocabs.fetchWord(vocabId, function(result) {
                self.vocab = result;
                self.renderFields().show();
            }, function(error) {
                console.error('VOCAB LOAD ERROR:', error);
            });
            return this;
        }
    });

    return WordDetailsComponent;

});