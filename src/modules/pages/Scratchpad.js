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
         * @constructor
         */
        initialize: function() {
            this.prompt = new Prompt();
            this.vocab = null;
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.scratchpad.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageScratchpad}
         */
        render: function() {
            this.renderTemplate(Template);
            this.renderDialog();
            this.prompt.setElement(this.$('.prompt-container'));
            this.prompt.hide().render();
            this.prompt.grading.hide();
            return this;
        },
        /**
         * @method renderPrompt
         * @returns {PageScratchpad}
         */
        renderPrompt: function() {
            this.prompt.set(this.vocab, 'rune', false).show();
        },
        /**
         * @method load
         * @param {String} writing
         * @returns {PageScratchpad}
         */
        load: function(writing) {
            var self = this;
            this.dialog.show('loading-scratchpad');
            this.$('.vocab-writing').text(writing);
            app.user.data.vocabs.fetchByQuery(writing, function(vocab) {
                self.vocab = vocab;
                self.renderPrompt();
                self.dialog.hide();
            }, function(error) {
                console.error(error);
                self.dialog.hide();
            });
            return this;
        }
    });

    return PageScratchpad;

});