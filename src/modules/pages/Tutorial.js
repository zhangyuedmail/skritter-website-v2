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
            this.content  = ['zh-十-0', 'zh-羊-0', 'zh-父-0'];
            this.prompt = new Prompt();
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
            this.prompt.render().hide();
            return this;
        },
        /**
         * @method load
         * @param {String} tutorialId
         * @returns {PageTutorial}
         */
        load: function(tutorialId) {
            var self = this;
            app.api.fetchVocabs({
                ids: this.content.join('|'),
                include_decomps: true,
                include_strokes: true
            }, function(result) {
                app.user.data.decomps.add(result.Decomps);
                app.user.data.strokes.add(result.Strokes);
                app.user.data.vocabs.add(result.Vocabs);
                switch (tutorialId) {
                    case '1':
                        self.showLesson1();
                        break;
                    case '2':
                        self.showLesson2();
                        break;
                    case '3':
                        self.showLesson3();
                        break;
                }
            }, function(error) {
                console.error('TUTORIAL LOAD ERROR:', error);
            });
            return this;
        },
        /**
         * @method remove
         * @returns {PageHome}
         */
        remove: function() {
            this.prompt.remove();
            return GelatoPage.prototype.remove.call(this);
        },
        /**
         * @method showLesson1
         */
        showLesson1: function() {
            var vocab = app.user.data.vocabs.get('zh-十-0');
            this.prompt.set(vocab.getPromptItems('rune'));
            this.prompt.show();
        },
        /**
         * @method showLesson2
         */
        showLesson2: function() {
            var vocab = app.user.data.vocabs.get('zh-羊-0');
            this.prompt.set(vocab.getPromptItems('rune'));
            this.prompt.show();
        },
        /**
         * @method showLesson2
         */
        showLesson3: function() {
            var vocab = app.user.data.vocabs.get('zh-父-0');
            this.prompt.set(vocab.getPromptItems('rune'));
            this.prompt.show();
        }
    });

    return PageTutorial;

});