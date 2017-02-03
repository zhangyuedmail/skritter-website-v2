const GelatoPage = require('gelato/page');
const Vocabs = require('collections/VocabCollection');
const Prompt = require('components/study/prompt/StudyPromptComponent.js');
const DemoCallToActionDialog = require('dialogs1/demo-call-to-action/view');
const DemoLanguageSelectDialog = require('dialogs1/demo-language-select/view');
const ItemsCollection = require('collections/ItemCollection');

/**
 * @class Demo
 * @extends {GelatoPage}
 */
const DemoPage = GelatoPage.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #contact-submit': 'handleClickContactSubmit'
  },

  /**
   * @property showFooter
   * @type Boolean
   */
  showFooter: false,

  /**
   * @property title
   * @type {String}
   */
  title: 'Demo - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Demo'),

  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(options) {
    this.dialog = null;
    this.lang = 'zh';
    this.notify = null;
    this.prompt = new Prompt({
      page: this,
      isDemo: true
    });
    this.promptItems = null;
    this.vocab = null;
    this.vocabs = new Vocabs();
    this.items = new ItemsCollection();
  },

  /**
   * @method render
   * @returns {DemoPage}
   */
  render: function() {
    this.renderTemplate();
    this.prompt.setElement('#demo-prompt-container').render();
    this.loadDemo();

    return this;
  },

  /**
   * @method loadDemo
   */
  loadDemo: function() {
    const self = this;

    async.waterfall(
      [
        function(callback) {
          self.dialog = new DemoLanguageSelectDialog();
          self.dialog.open();
          self.dialog.once('select', callback);
        },
        function(lang, callback) {
          ScreenLoader.show();
          ScreenLoader.post('Loading demo word');
          app.mixpanel.track('Started demo', {'Language': lang});
          self.lang = lang;
          self.vocabs.fetch({
            data: {
              include_decomps: true,
              include_sentences: true,
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
        },
        function(vocab, callback) {
          app.user.characters.fetch({
              data: {
                languageCode: vocab.get('lang'),
                writings: vocab.get('writing')
              },
              remove: false,
              error: function(error) {
                callback(error);
              },
              success: function() {
                callback(null, vocab);
              }
            }
          );
        }
      ],
      function(error, vocab) {
        ScreenLoader.hide();
        self.prompt.show();
        self.promptItems = vocab.getPromptItems('rune');
        self.promptItems.teachAll();
        self.step1();
      }
    );
  },

  /**
   * @method step1
   */
  step1: function() {
    this.prompt.tutorial.show();
    this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step1')));
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
    app.mixpanel.track('Completed tracing demo character #1');
    this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step2')));
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
    app.mixpanel.track('Completed writing demo character #1');
    this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step3')));
    this.prompt.$('#toolbar-action-container').hide();
    this.prompt.once('character:complete', this.step4.bind(this));
  },

  /**
   * @method step4
   */
  step4: function() {
    app.mixpanel.track('Completed tracing demo character #2');
    this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step4')));
    this.prompt.part.eraseCharacter();
    this.prompt.review.set('score', 3);
    this.prompt.$('#toolbar-action-container').show();
    this.prompt.once('character:complete', this.step5.bind(this));
  },

  /**
   * @method step5
   */
  step5: function() {
    app.mixpanel.track('Completed writing demo character #2');
    this.dialog = new DemoCallToActionDialog();
    this.dialog.open();
  },

  /**
   * @method remove
   * @returns {Contact}
   */
  remove: function() {
    this.prompt.remove();

    return GelatoPage.prototype.remove.call(this);
  }
});

module.exports = DemoPage;
