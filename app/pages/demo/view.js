var GelatoPage = require('gelato/page');

var Vocabs = require('collections/vocabs');
var Prompt = require('components/study/prompt/view');
var DefaultNavbar = require('navbars/default/view');

var DemoCallToActionDialog = require('dialogs1/demo-call-to-action/view');
var DemoLanguageSelectDialog = require('dialogs1/demo-language-select/view');

/**
 * @class Demo
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @param {Object} [options]
     * @constructor
     */
    initialize: function(options) {
        this.dialog = null;
        this.lang = 'zh';
        this.navbar = new DefaultNavbar();
        this.notify = null;
        this.prompt = new Prompt();
        this.promptItems = null;
        this.vocab = null;
        this.vocabs = new Vocabs();
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #contact-submit': 'handleClickContactSubmit'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Demo - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Contact}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.prompt.setElement('#demo-prompt-container').render().hide();
        this.loadDemo();
        return this;
    },
    /**
     * @method loadDemo
     */
    loadDemo: function() {
        var self = this;
        async.waterfall([
            function(callback) {
                self.dialog = new DemoLanguageSelectDialog();
                self.dialog.open();
                self.dialog.once('select', callback);
            },
            function(lang, callback) {
                ScreenLoader.show();
                ScreenLoader.post('Loading demo word');
                self.vocabs.fetch({
                    data: {
                        include_decomps: true,
                        include_sentences: true,
                        include_strokes: true,
                        ids: lang === 'zh' ? 'zh-你好-0' : 'ja-元気-0'
                    },
                    error: function(vocabs, error) {
                        callback(error);
                    },
                    success: function(vocabs) {
                        app.set('demoLang', lang);
                        self.vocab = vocabs.at(0);
                        callback(null, self.vocab);
                    }
                });
            },
            function(vocab, callback) {
                if (vocab.has('containedVocabIds')) {
                    self.vocabs.fetch({
                        data: {
                            include_decomps: true,
                            include_sentences: true,
                            include_strokes: true,
                            ids: vocab.get('containedVocabIds').join('|')
                        },
                        remove: false,
                        error: function(error) {
                            callback(error);
                        },
                        success: function() {
                            callback(null, vocab);
                        }
                    });
                } else {
                    callback(null, vocab);
                }
            }
        ], function(error, vocab) {
            ScreenLoader.hide();
            self.prompt.show();
            self.promptItems = vocab.getPromptItems('rune');
            self.promptItems.teachAll();
            self.step1();
        });
    },
    /**
     * @method step1
     */
    step1: function() {
        this.prompt.tutorial.show();
        this.prompt.tutorial.setMessage(require('./notify-step1')());
        this.prompt.set(this.promptItems);
        this.prompt.shortcuts.unregisterAll();
        this.prompt.$('#navigation-container').hide();
        this.prompt.$('#toolbar-action-container').hide();
        this.prompt.$('#toolbar-vocab-container').hide();
        this.prompt.once('character:complete', this.step2.bind(this));
    },
    /**
     * @method step2
     */
    step2: function() {
        this.prompt.tutorial.setMessage(require('./notify-step2')());
        this.prompt.part.eraseCharacter();
        this.prompt.review.set('score', 3);
        this.prompt.$('#toolbar-action-container').show();
        this.prompt.$('#toolbar-grading-container').hide();
        this.prompt.once('reviews:next', this.step3.bind(this));
    },
    /**
     * @method step3
     */
    step3: function() {
        this.prompt.tutorial.setMessage(require('./notify-step3')());
        this.prompt.$('#toolbar-action-container').hide();
        this.prompt.once('character:complete', this.step4.bind(this));
    },
    /**
     * @method step4
     */
    step4: function() {
        this.prompt.tutorial.setMessage(require('./notify-step4')());
        this.prompt.part.eraseCharacter();
        this.prompt.review.set('score', 3);
        this.prompt.$('#toolbar-action-container').show();
        this.prompt.once('character:complete', this.step5.bind(this));
    },
    /**
     * @method step5
     */
    step5: function() {
        this.dialog = new DemoCallToActionDialog();
        this.dialog.open();
    },
    /**
     * @method remove
     * @returns {Contact}
     */
    remove: function() {
        this.navbar.remove();
        this.prompt.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
