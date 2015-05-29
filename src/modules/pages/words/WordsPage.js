/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/words/words-template.html',
    'core/modules/GelatoPage'
], function(
    Template, 
    GelatoPage
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
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'Words - ' + i18n.global.title,
        /**
         * @method render
         * @returns {WordsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return WordsPage;

});