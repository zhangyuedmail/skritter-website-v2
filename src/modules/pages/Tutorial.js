/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/tutorial.html',
    'core/modules/GelatoPage',
    'modules/components/Prompt'
], function(Template, GelatoPage, Prompt) {

    /**
     * @class PageTutorial
     * @extends GelatoPage
     */
    var PageTutorial = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.index = 0;
            this.prompt = new Prompt();
            this.tutorials = null;
            this.listenTo(this.prompt, 'prompt:next', this.handlePromptNext);
        },
        /**
         * @property title
         * @type String
         */
        title: 'Tutorial - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {PageTutorial}
         */
        render: function() {
            this.renderTemplate(Template);
            this.prompt.setElement(this.$('#prompt-container'));
            this.prompt.render();
            return this;
        },
        /**
         * @method renderPrompt
         * @returns {PageTutorial}
         */
        renderPrompt: function() {
            var module = this.tutorials.at(this.index);
            var vocab = app.user.data.vocabs.get(module.get('vocabId'));
            this.prompt.detail.$('#tutorial-title').text(module.get('title'));
            this.prompt.detail.$('#tutorial-content').text(module.get('content'));
            this.prompt.set(vocab.getPromptItems(module.get('part')));
            return this;
        },
        /**
         * @method load
         * @param {String} module
         * @param {String} index
         * @returns {PageTutorial}
         */
        load: function(module, index) {
            var self = this;
            this.index = index || 0;
            this.tutorials = app.tutorials.getByModule(module);
            Async.series([
                function(callback) {
                    app.dialog.show('loading');
                    self.tutorials.fetch(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('TUTORIAL LOAD ERROR:', error);
                } else {
                    app.dialog.hide();
                    self.renderPrompt();
                }
            });
            return this;
        },
        /**
         * @method handlePromptNext
         */
        handlePromptNext: function() {
            this.index++;
            this.renderPrompt();
        },
        /**
         * @method remove
         * @returns {PageHome}
         */
        remove: function() {
            this.prompt.remove();
            return GelatoPage.prototype.remove.call(this);
        }
    });

    return PageTutorial;

});