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
        },
        /**
         * @property title
         * @type String
         */
        title: i18n.scratchpad.title + ' - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageScratchpad}
         */
        render: function() {
            this.renderTemplate(Template);
            this.renderDialog();
            this.prompt.setElement(this.$('.prompt-container'));
            this.prompt.render().hide();
            this.prompt.grading.hide();
            return this;
        },
        /**
         * @method load
         * @param {String} writing
         * @returns {PageScratchpad}
         */
        load: function(writing) {
            var self = this;
            app.dialog.show('loading-scratchpad');
            this.$('.vocab-writing').text(writing);
            app.user.data.vocabs.fetchByQuery(writing, function(vocab) {
                self.prompt.set(vocab, 'rune', false);
                self.prompt.show();
                app.dialog.hide();
            }, function(error) {
                console.error(error);
                app.dialog.hide();
            });
            return this;
        }
    });

    return PageScratchpad;

});