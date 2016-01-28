var GelatoPage = require('gelato/page');

//var MarketingFooter = require('components/marketing/footer/view');
var Vocabs = require('collections/vocabs');
var Prompt = require('components/study/prompt/view');
var DefaultNavbar = require('navbars/default/view');

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
        ScreenLoader.show();
        //this.footer = new MarketingFooter();
        this.lang = options.lang || 'zh';
        this.navbar = new DefaultNavbar();
        this.notify = null;
        this.prompt = new Prompt();
        this.vocab = null;
        this.vocabs = new Vocabs();
        this.loadDemo();
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
        //this.footer.setElement('#footer-container').render();
        this.navbar.setElement('#navbar-container').render();
        this.prompt.setElement('#demo-prompt-container').render();
        return this;
    },
    loadDemo: function() {
        var self = this;
        async.waterfall([
            function(callback) {
                ScreenLoader.post('Loading demo word');
                self.vocabs.fetch({
                    data: {
                        include_decomps: true,
                        include_sentences: true,
                        include_strokes: true,
                        ids: self.lang === 'zh' ? 'zh-你好-0' : 'ja-元気-0'
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
            self.prompt.set(vocab.getPromptItems('rune'));
            self.prompt.part.teachCharacter();
            self.step1();
            ScreenLoader.hide();
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
                delay: 0,
                element: this.$('gelato-component[data-name="study-prompt"]'),
                placement: {
                    from: 'top',
                    align: 'left'
                }
            }
        );
        this.prompt.$('#toolbar-action-container').hide();
        this.prompt.once('next', this.step2.bind(this));
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
                delay: 0,
                element: this.$('gelato-component[data-name="study-prompt"]'),
                placement: {
                    from: 'top',
                    align: 'left'
                }
            }
        );
        this.prompt.part.eraseCharacter();
        this.prompt.$('#toolbar-action-container').show();
        this.prompt.$('#toolbar-grading-container').hide();
        this.prompt.once('next', this.step2.bind(this));
        this.prompt.canvas.once('input:up', function() {
            $.notifyClose();
        });
    },
    /**
     * @method remove
     * @returns {Contact}
     */
    remove: function() {
        this.navbar.remove();
        //this.footer.remove();
        this.prompt.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
