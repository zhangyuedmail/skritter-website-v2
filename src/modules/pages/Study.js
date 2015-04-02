/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/study.html',
    'core/modules/GelatoPage',
    'modules/components/Prompt'
], function(Template, GelatoPage, Prompt) {

    /**
     * @class PageStudy
     * @extends GelatoPage
     */
    var PageStudy = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.item = null;
            this.prompt = new Prompt();
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.study.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.renderTemplate(Template);
            this.renderFields();
            this.prompt.setElement(this.$('.prompt-container')).render().hide();
            this.listenTo(this.prompt, 'prompt:next', $.proxy(this.handlePromptNext, this));
            this.listenTo(this.prompt, 'prompt:previous', $.proxy(this.handlePromptPrevious, this));
            this.loadPrompt();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageStudy}
         */
        renderFields: function() {
            this.$('.settings-name').text(app.user.settings.get('name'));
            return this;
        },
        /**
         * @method handlePromptNext
         * @param {PromptResult} result
         */
        handlePromptNext: function(result) {
            console.log('RESULT', result);
            this.item.update(result);
            this.loadPrompt();
        },
        /**
         * @method handlePromptPrevious
         */
        handlePromptPrevious: function() {},
        /**
         * @method loadPrompt
         * @returns {PageStudy}
         */
        loadPrompt: function() {
            var self = this;
            app.user.data.items.loadNext(function(item) {
                self.item = item;
                self.prompt.set(item.getVocab(), item.get('part'), item.isNew());
                self.prompt.show();
            }, function(error) {
                console.log('PROMPT LOAD ERROR:', error);
            });
            return this;
        }
    });

    return PageStudy;

});