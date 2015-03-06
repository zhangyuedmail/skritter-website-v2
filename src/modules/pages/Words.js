/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/words.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageWords
     * @extends GelatoPage
     */
    var PageWords = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: app.strings.words.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageWords}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PageWords;

});