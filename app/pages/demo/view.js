var GelatoPage = require('gelato/page');

var MarketingFooter = require('components/marketing/footer/view');
var Vocabs = require('collections/vocabs');
var Prompt = require('components/study/prompt/view');
var DefaultNavbar = require('navbars/default/view');

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
        this.footer = new MarketingFooter();
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
        this.footer.setElement('#footer-container').render();
        this.navbar.setElement('#navbar-container').render();
        this.prompt.setElement('#demo-prompt-container').render();
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
                //self.dialog.render();
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
            self.promptItems = vocab.getPromptItems('rune');
            self.promptItems.teachAll();
            self.step1();
        });
    },
    /**
     * @method step1
     */
    step1: function() {
        $.notify(
            {
                message: require('./notify-step1'),
                type: 'pastel-info'
            },
            {
                allow_dismiss: false,
                animate: {
                    enter: '',
                    exit: 'animated zoomOut'
                },
                delay: 0,
                element: this.$('gelato-component[data-name="study-prompt"]'),
                placement: {
                    from: 'top',
                    align: 'left'
                }
            }
        );
        this.prompt.set(this.promptItems);
        this.prompt.shortcuts.unregisterAll();
        this.prompt.$('#navigation-container').hide();
        this.prompt.$('#toolbar-action-container').hide();
        this.prompt.once('character:complete', this.step2.bind(this));
        this.prompt.canvas.once('input:up', function() {
            $.notifyClose();
        });
    },
    /**
     * @method step2
     */
    step2: function() {
        $.notify(
            {
                message: require('./notify-step2'),
                type: 'pastel-info'
            },
            {
                allow_dismiss: false,
                animate: {
                    enter: '',
                    exit: 'animated zoomOut'
                },
                delay: 0,
                element: this.$('gelato-component[data-name="study-prompt"]'),
                placement: {
                    from: 'top',
                    align: 'left'
                }
            }
        );
        this.prompt.part.eraseCharacter();
        this.prompt.review.set('score', 3);
        this.prompt.$('#toolbar-action-container').show();
        this.prompt.$('#toolbar-grading-container').hide();
        this.prompt.once('reviews:next', this.step3.bind(this));
        this.prompt.canvas.once('input:up', function() {
            $.notifyClose();
        });
    },
    /**
     * @method step3
     */
    step3: function() {
        $.notify(
            {
                message: require('./notify-step3'),
                type: 'pastel-info'
            },
            {
                allow_dismiss: false,
                animate: {
                    enter: '',
                    exit: 'animated zoomOut'
                },
                delay: 0,
                element: this.$('gelato-component[data-name="study-prompt"]'),
                placement: {
                    from: 'top',
                    align: 'left'
                }
            }
        );
        this.prompt.$('#toolbar-action-container').hide();
        this.prompt.once('character:complete', this.step4.bind(this));
        this.prompt.canvas.once('input:up', function() {
            $.notifyClose();
        });
    },
    /**
     * @method step4
     */
    step4: function() {
        $.notify(
            {
                message: require('./notify-step4'),
                type: 'pastel-info'
            },
            {
                allow_dismiss: false,
                animate: {
                    enter: '',
                    exit: 'animated zoomOut'
                },
                delay: 0,
                element: this.$('gelato-component[data-name="study-prompt"]'),
                placement: {
                    from: 'top',
                    align: 'left'
                }
            }
        );
        this.prompt.part.eraseCharacter();
        this.prompt.review.set('score', 3);
        this.prompt.$('#toolbar-action-container').show();
        this.prompt.once('character:complete', this.step5.bind(this));
        this.prompt.canvas.once('input:up', function() {
            $.notifyClose();
        });
    },
    /**
     * @method step5
     */
    step5: function() {
        app.router.navigate('signup', {trigger: true});
    },
    /**
     * @method remove
     * @returns {Contact}
     */
    remove: function() {
        this.navbar.remove();
        this.footer.remove();
        this.prompt.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
