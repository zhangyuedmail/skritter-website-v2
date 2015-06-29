/**
 * @module Application
 * @submodule Pages
 */
define([
    'core/modules/GelatoPage',
    'require.text!modules/pages/words/words-template.html',
    'modules/components/word/details/WordDetailsComponent'
], function(
    GelatoPage,
    Template,
    WordComponent
) {

    /**
     * @class WordsPage
     * @extends GelatoPage
     */
    var WordsPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.word = new WordComponent();
        },
        /**
         * @property title
         * @type String
         */
        title: 'Words - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {WordsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.word.setElement(this.$('#word-container')).render();
            return this;
        },
        /**
         * @method load
         * @param {String} vocabId
         * @returns {WordsPage}
         */
        load: function(vocabId) {
            this.word.load(vocabId);
            return this;
        }
    });

    return WordsPage;

});