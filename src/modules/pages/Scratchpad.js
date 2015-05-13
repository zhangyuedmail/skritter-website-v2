/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/scratchpad.html',
    'core/modules/GelatoPage',
    'modules/components/Prompt'
], function(Template, GelatoPage, Prompt) {

    /**
     * @class PageScratchpad
     * @extends GelatoPage
     */
    var PageScratchpad = GelatoPage.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
            this.prompt = new Prompt({app: this.app});
        },
        /**
         * @property title
         * @type String
         */
        title: 'Scratchpad - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**s
         * @method render
         * @returns {PageScratchpad}
         */
        render: function() {
            this.renderTemplate(Template);
            this.prompt.setElement(this.$('#prompt-container')).render();
            this.prompt.hide();
            return this;
        },
        /**
         * @method load
         * @param {String} writing
         * @returns {PageScratchpad}
         */
        load: function(writing) {
            var self = this;
            app.user.data.vocabs.fetchByQuery(writing, function(result) {
                self.prompt.set(result.getPromptItems('rune'));
                self.prompt.show();
            }, function(error) {
                console.error(error);
            });
            return this;
        }
    });

    return PageScratchpad;

});