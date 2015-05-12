/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/tutorial.html',
    'core/modules/GelatoPage',
    'modules/collections/TutorialModules',
    'modules/components/Prompt'
], function(Template, GelatoPage, TutorialModules, Prompt) {

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
            this.prompt = new Prompt();
            this.tutorials = new TutorialModules();
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
         * @param {String} language
         * @param {String} page
         * @returns {PageTutorial}
         */
        load: function(language, page) {
            var self = this;
            Async.series([
                /**
                function(callback) {
                    if (language) {
                        callback();
                    } else {
                        self.listenToOnce(app.dialog, 'tutorial-select-language:click', function(action) {
                            callback();
                        });
                        app.dialog.show('tutorial-select-language');
                    }
                },
                function(callback) {
                    if (language) {
                        callback();
                    } else {
                        self.listenToOnce(app.dialog, 'hidden', function() {
                            callback();
                        });
                        app.dialog.hide();
                    }
                },
                function(callback) {
                    if (page) {
                        callback();
                    } else {
                        self.listenToOnce(app.dialog, 'tutorial-select-level:click', function(action) {
                            callback();
                        });
                        app.dialog.show('tutorial-select-level');
                    }
                },
                function(callback) {
                    if (page) {
                        callback();
                    } else {
                        self.listenToOnce(app.dialog, 'hidden', function() {
                            callback();
                        });
                        app.dialog.hide();
                    }
                },
                 **/
                function(callback) {
                    app.dialog.show('loading');
                    app.api.fetchVocabs({
                        ids: self.tutorials.getVocabIds().join('|'),
                        include_decomps: true,
                        include_strokes: true
                    }, function(result) {
                        app.user.data.decomps.add(result.Decomps);
                        app.user.data.strokes.add(result.Strokes);
                        app.user.data.vocabs.add(result.Vocabs);
                        callback();
                    }, function(error) {
                        callback(error)
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('TUTORIAL LOAD ERROR:', error);
                } else {
                    app.dialog.hide();
                    self.showLesson1();
                }
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
            var module = this.tutorials.get(1);
            var vocab = app.user.data.vocabs.get(module.get('vocabId'));
            this.listenToOnce(this.prompt, 'prompt:next', this.showLesson2);
            this.prompt.detail.$('#tutorial-title').text(module.get('title'));
            this.prompt.detail.$('#tutorial-content').text(module.get('content'));
            this.prompt.set(vocab.getPromptItems('rune'));
            this.prompt.show();
        },
        /**
         * @method showLesson2
         */
        showLesson2: function() {
            var module = this.tutorials.get(2);
            var vocab = app.user.data.vocabs.get(module.get('vocabId'));
            this.listenToOnce(this.prompt, 'prompt:next', this.showLesson3);
            this.prompt.detail.$('#tutorial-title').text(module.get('title'));
            this.prompt.detail.$('#tutorial-content').text(module.get('content'));
            this.prompt.set(vocab.getPromptItems('rune'));
            this.prompt.show();
        },
        /**
         * @method showLesson2
         */
        showLesson3: function() {
            var module = this.tutorials.get(3);
            var vocab = app.user.data.vocabs.get(module.get('vocabId'));
            //this.listenToOnce(this.prompt, 'prompt:next', this.showLesson2);
            this.prompt.detail.$('#tutorial-title').text(module.get('title'));
            this.prompt.detail.$('#tutorial-content').text(module.get('content'));
            this.prompt.set(vocab.getPromptItems('rune'));
            this.prompt.show();
        }
    });

    return PageTutorial;

});