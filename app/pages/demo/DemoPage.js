const GelatoPage = require('gelato/page');
const Vocabs = require('collections/VocabCollection');
const Prompt = require('components/prompt/StudyPromptComponent.js');
const DemoLanguageSelectDialog = require('dialogs1/demo-language-select/DemoLanguageSelectDialog.js');
const DemoProgressComponent = require('components/demo/DemoProgressComponent.js');
const ItemsCollection = require('collections/ItemCollection');
const NavbarMobileDemo = require('components/navbars/NavbarMobileDemoComponent.js');
const vent = require('vent');

/**
 * A page that demonstrates Skritter to a user by taking them through
 * a guided tour of various prompts and features.
 * @class Demo
 * @extends {GelatoPage}
 */
const DemoPage = GelatoPage.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #contact-submit': 'handleClickContactSubmit',
  },

  navbarOptions: {
    showBackBtn: true,
    showSyncBtn: false,
  },

  mobileNavbar: NavbarMobileDemo,

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
   * Binds instance methods to the correct context, sets up instance variables,
   * the prompt, and some event listeners.
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function (options) {
    _.bindAll(this, 'teachDemoChar1', 'teachDemoChar2', 'writeDemoChar1',
      'writeDemoChar2', 'completeDemo', 'switchToWriting', 'teachEraseDemoChar1',
      'teachDefinitionPrompt1', 'teachEraseDemoChar2', 'teachReadingPrompt1',
      'teachTonePrompt1', 'teachSRS1', 'performPostDemoAction');

    this.lang = 'zh';
    this.notify = null;
    this.prompt = new Prompt({
      page: this,
      isDemo: true,
      showTapToAdvanceText: true,
      showGradingButtons: false,
    });
    this.promptItems = null;
    this.vocab = null;
    this.vocabs = new Vocabs();
    this.items = new ItemsCollection();
    this._loggingInAnon = null;

    if (!app.isMobile()) {
      this._views['progress'] = new DemoProgressComponent({
        demoPage: this,
        firstStep: 'languageSelection',
      });
    }

    this.listenTo(vent, 'demo:skip', this.completeDemo);
    this.setDemoProgress('languageSelection');
  },

  /**
   * Renders the page and subviews
   * @method render
   * @returns {DemoPage}
   */
  render: function () {
    this.renderTemplate();

    if (this._views['progress']) {
      this.$('#progress-container').html(this._views['progress'].render().el);
    }

    this.prompt.setElement('#demo-prompt-container').render();

    this.loadDemo();

    this.$('#demo-prompt-container').addClass('hidden');

    return this;
  },

  /**
   * Sets up the demo. Fetches data related to the vocab, shows
   * loading screens, and loads the first teaching prompt.
   * @method loadDemo
   */
  loadDemo: function () {
    const self = this;

    async.waterfall(
      [
        // language selection
        function (callback) {
          // we have separate apps for zh & ja, so lang is already known on mobile
          if (app.isCordova()) {
            callback(null, app.getLanguage());
          } else {
            self._views['languageSelectDialog'] = new DemoLanguageSelectDialog();
            self._views['languageSelectDialog'].open();
            self._views['languageSelectDialog'].once('select', callback);
          }
        },

        // set vocab data
        function (lang, callback) {
          self._fetchDemoVocab(lang);
          callback(null, self.vocab);
        },

        // fetch contained data
        function (vocab, callback) {
          if (vocab.has('containedVocabIds')) {
            self.vocabs.fetch({
              data: {
                include_decomps: true,
                include_sentences: true,
                ids: vocab.get('containedVocabIds').join('|'),
              },
              remove: false,
              error: function (error) {
                callback(error);
              },
              success: function () {
                callback(null, vocab);
              },
            });
          } else {
            callback(null, vocab);
          }
        },

        // fetch character data
        function (vocab, callback) {
          app.user.characters.fetch({
              data: {
                languageCode: vocab.get('lang'),
                writings: vocab.get('writing'),
              },
              remove: false,
              error: function (error) {
                callback(error);
              },
              success: function () {
                callback(null, vocab);
              },
            }
          );
        },
      ],

      // finally loading prompts and finish setup
      function (error, vocab) {
        self.$('#demo-prompt-container').removeClass('hidden');
        ScreenLoader.hide();
        self.prompt.show();
        const runeItems = vocab.getPromptItems('rune');
        self.promptItems = runeItems;

        self.promptItems.teachAll();

        // uncomment for faster testing shortcut
        // self.teachTonePrompt1();
        self.teachDemoChar1();
      }
    );
  },

  /**
   * Shows the screenloader and sets the initial vocab data for the demo
   * @method _fetchDemoVocab
   * @private
   */
  _fetchDemoVocab: function (lang) {
    ScreenLoader.show();
    ScreenLoader.post('Loading demo word');
    this.lang = lang;

    const vocabDataZh = {'Vocabs': [{'lang': 'zh', 'sentenceIds': [], 'style': 'both', 'audio': 'http://storage.googleapis.com/skritter_audio/zh/cpod/4920340100677632.mp3', 'toughness': 2, 'creator': 'CPAPI', 'dictionaryLinks': {'you-dao': 'http://dict.youdao.com/search?q=%E4%B8%AD%E6%96%87&keyfrom=dict.index', 'mdbg': 'http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=0&wdqb=%E4%B8%AD%E6%96%87', 'yellow-bridge': 'http://www.yellowbridge.com/chinese/dictionary.php?word=%E4%B8%AD%E6%96%87', 'chinesepod': 'http://chinesepod.com/tools/glossary/entry/%E4%B8%AD%E6%96%87', 'zdic': '', 'hanzicraft': 'http://www.hanzicraft.com/character/%E4%B8%AD%E6%96%87', 'tatoeba-zh': 'http://tatoeba.org/eng/sentences/search?query=%E4%B8%AD%E6%96%87&from=cmn&to=und', 'tw-moe': 'https://www.moedict.tw/%E4%B8%AD%E6%96%87'}, 'bannedParts': [], 'created': 1281392448, 'ilk': 'word', 'writing': '\u4e2d\u6587', 'audios': [{'source': 'cpod', 'reading': 'zhong1wen2', 'mp3': 'http://storage.googleapis.com/skritter_audio/zh/cpod/4920340100677632.mp3', 'writing': null, 'id': '4920340100677632'}, {'source': 'tan', 'reading': 'zhong1wen2', 'mp3': 'http://storage.googleapis.com/skritter_audio/zh/tan/5250798843854848.mp3', 'writing': null, 'id': '5250798843854848'}], 'containedVocabIds': ['zh-\u4e2d-0', 'zh-\u6587-0'], 'audioURL': 'http://storage.googleapis.com/skritter_audio/zh/cpod/4920340100677632.mp3', 'toughnessString': 'easier', 'definitions': {'en': 'Chinese (language)'}, 'starred': false, 'reading': 'Zhong1wen2', 'id': 'zh-\u4e2d\u6587-0', 'sentenceId': 'zh-\u6211\u5b66\u4e60\u4e2d\u6587-0'}], 'statusCode': 200, 'Decomps': [], 'Sentences': [{'lang': 'zh', 'sentenceIds': [], 'style': 'simp', 'toughness': 8, 'creator': 'Hutongschool', 'segmentation': {'readingFillers': ['', ' ', ' ', ''], 'reading': 'wo3 xue2xi2 Zhong1wen2', 'wordWritings': ['\u6211', '\u5b66\u4e60', '\u4e2d\u6587'], 'writing': '\u6211 \u5b66\u4e60 \u4e2d\u6587', 'wordVocabVotes': [0, 4, 8], 'wordReadings': ['wo3', 'xue2xi2', 'Zhong1wen2'], 'wordVocabIds': ['zh-\u6211-0', 'zh-\u5b66\u4e60-0', 'zh-\u4e2d\u6587-0'], 'overallVotes': 20, 'writingFillers': ['', '', '', '']}, 'bannedParts': [], 'created': 1373960687, 'ilk': 'sent', 'writing': '\u6211 \u5b66\u4e60 \u4e2d\u6587', 'dictionaryLinks': {'you-dao': 'http://dict.youdao.com/search?q=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87&keyfrom=dict.index', 'mdbg': 'http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=0&wdqb=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87', 'yellow-bridge': 'http://www.yellowbridge.com/chinese/dictionary.php?word=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87', 'chinesepod': 'http://chinesepod.com/tools/glossary/entry/%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87', 'zdic': '', 'hanzicraft': 'http://www.hanzicraft.com/character/%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87', 'tatoeba-zh': 'http://tatoeba.org/eng/sentences/search?query=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87&from=cmn&to=und', 'tw-moe': 'https://www.moedict.tw/%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87'}, 'containedVocabIds': ['zh-\u6211-0', 'zh-\u5b66-0', 'zh-\u4e60-0', 'zh-\u4e2d-0', 'zh-\u6587-0'], 'toughnessString': 'harder', 'definitions': {'en': 'I study Chinese.'}, 'starred': false, 'reading': 'wo3 xue2xi2 Zhong1wen2', 'id': 'zh-\u6211\u5b66\u4e60\u4e2d\u6587-0'}]};
    const vocabDataJa = {'Vocabs': [{'lang': 'ja', 'rareKanji': false, 'sentenceId': 'ja-\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059-0', 'audio': 'http://storage.googleapis.com/skritter_audio/ja/kaori/4862201342984192.mp3', 'toughness': 2, 'sentenceIds': [], 'dictionaryLinks': {'wwwjdic': 'http://nihongo.monash.edu/cgi-bin/wwwjdic?1MMJ%E6%97%A5%E6%9C%AC', 'jisho': 'http://jisho.org/words?jap=%E6%97%A5%E6%9C%AC', 'goo': 'http://dictionary.goo.ne.jp/srch/je/%E6%97%A5%E6%9C%AC/m0u/', 'weblio': 'http://ejje.weblio.jp/content/%E6%97%A5%E6%9C%AC', 'alc': 'http://eow.alc.co.jp/%E6%97%A5%E6%9C%AC/UTF-8/'}, 'bannedParts': [], 'creator': 'mtaran', 'ilk': 'word', 'writing': '\u65e5\u672c', 'audios': [{'source': 'kaori', 'reading': '\u306b\u307b\u3093', 'mp3': 'http://storage.googleapis.com/skritter_audio/ja/kaori/4862201342984192.mp3', 'writing': '\u65e5\u672c', 'id': '4862201342984192'}, {'source': 'kaori', 'reading': '\u306b\u3063\u307d\u3093', 'mp3': 'http://storage.googleapis.com/skritter_audio/ja/kaori/4974911622742016.mp3', 'writing': '\u65e5\u672c', 'id': '4974911622742016'}], 'created': 1249318103, 'containedVocabIds': ['ja-\u65e5-0', 'ja-\u672c-0'], 'audioURL': 'http://storage.googleapis.com/skritter_audio/ja/kaori/4862201342984192.mp3', 'toughnessString': 'easier', 'definitions': {'en': 'Japan'}, 'starred': false, 'reading': '\u306b\u307b\u3093, \u306b\u3063\u307d\u3093', 'id': 'ja-\u65e5\u672c-0'}], 'statusCode': 200, 'Decomps': [], 'Sentences': [{'lang': 'ja', 'rareKanji': false, 'segmentation': {'readingFillers': ['', '', '', '', '', '', '', ''], 'reading': '\u3044\u3051\u3070\u306a\u306f\u306b\u3063\u307d\u3093\u306e\u3076\u3093\u304b\u3067\u3059\u3002', 'wordWritings': ['\u751f\u3051\u82b1', '\u306f', '\u65e5\u672c', '\u306e', '\u6587\u5316', '\u3067\u3059', '\u3002'], 'writing': '\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059\u3002', 'wordVocabVotes': [0, 0, 0, 0, 0, 0, 0], 'wordReadings': ['\u3044\u3051\u3070\u306a', '\u306f', '\u306b\u3063\u307d\u3093', '\u306e', '\u3076\u3093\u304b', '\u3067\u3059', '\u3002'], 'wordVocabIds': ['ja-\u751f\u3051\u82b1-0', 'ja-\u306f-1', 'ja-\u65e5\u672c-0', 'ja-\u306e-0', 'ja-\u6587\u5316-0', 'ja-\u3067\u3059-0', ''], 'overallVotes': 6, 'writingFillers': ['', '', '', '', '', '', '', '']}, 'toughness': 42, 'creator': 'Tatoeba', 'dictionaryLinks': {'wwwjdic': 'http://nihongo.monash.edu/cgi-bin/wwwjdic?1MMJ%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99', 'jisho': 'http://jisho.org/words?jap=%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99', 'goo': 'http://dictionary.goo.ne.jp/srch/je/%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99/m0u/', 'weblio': 'http://ejje.weblio.jp/content/%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99', 'alc': 'http://eow.alc.co.jp/%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99/UTF-8/'}, 'bannedParts': [], 'ilk': 'sent', 'writing': '\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059\u3002', 'containedVocabIds': ['ja-\u751f-0', 'ja-\u82b1-0', 'ja-\u65e5-0', 'ja-\u672c-0', 'ja-\u6587-0', 'ja-\u5316-0'], 'sentenceIds': [], 'toughnessString': 'unknown', 'definitions': {'en': 'Flower arrangement is a part of Japanese culture.'}, 'starred': false, 'reading': '\u3044\u3051\u3070\u306a\u306f\u306b\u3063\u307d\u3093\u306e\u3076\u3093\u304b\u3067\u3059\u3002', 'id': 'ja-\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059-0'}]};

    this.vocabs.add(lang === 'zh' ? vocabDataZh.Vocabs : vocabDataJa.Vocabs);
    app.set('demoLang', lang);
    app.user.set('targetLang', lang);
    this.vocab = this.vocabs.at(0);
  },

  /**
   * First prompt of the demo. Teaches how to write the first character
   * in the user's chosen language
   * @method teachDemoChar1
   */
  teachDemoChar1: function () {
    this.prompt.set(this.promptItems);
    this.prompt.shortcuts.unregisterAll();
    this.prompt.$('#navigation-container').hide();
    this.prompt.$('#toolbar-action-container').hide();
    this.prompt.$('#toolbar-vocab-container').hide();
    this.prompt.once('character:complete', this.teachDemoChar2);

    this.setDemoProgress('teachDemoChar1');
    this.showDemoGuidePopup();
  },

  /**
   * Teaches how to write the second character in the demo word
   * @method teachDemoChar2
   */
  teachDemoChar2: function () {
    this.setDemoProgress('teachDemoChar2', true);

    this.prompt.$('#toolbar-action-container').hide();
    this.prompt.once('next', () => {
      this.switchToWriting();
      this.writeDemoChar1();
    });
  },

  /**
   * Erases the characters and goes back to the beginning of the review
   */
  switchToWriting: function () {
    this.prompt.part.eraseCharacter();
    this.prompt.previous();
    this.prompt.review.set('score', 3);
    this.prompt.part.eraseCharacter();
    this.$('#study-prompt-toolbar-action').hide();
  },

  /**
   * Prompt that allows the user to freely write the first character as
   * a "normal" rune prompt
   * @method writeDemoChar1
   */
  writeDemoChar1: function () {
    this.setDemoProgress('writeDemoChar1');

    vent.trigger('notification:show', {
      exitAnimation: 'fadeButton',
      dialogTitle: 'Getting Hints',
      showTitle: true,
      keepAlive: true,
      showConfirmButton: app.isMobile(),
      body: this.parseTemplate(require('./notify-step2')),
      style: {
        backdrop: {
          top: app.isMobile() ? '49px' : '0%',
          left: app.isMobile() ? '0px' : '50%',
          height: '100%',
        },
        dialog: {
          top: '20%',
          height: 'auto',
          left: app.isMobile() ? '0px' : '50%',
          width: app.isMobile() ? '100%' : '50%',
        },
      },
    });

    this.prompt.review.set('score', 3);
    this.prompt.$('#toolbar-action-container').show();

    this.prompt.once('character:complete', () => {
        this.$('.tap-to-advance-wrapper').removeClass('hidden');
        this.prompt.$('.grading-btn-wrapper').addClass('hidden');
    });
    this.prompt.once('reviews:next', this.writeDemoChar2);
  },

  /**
   * Prompt that allows the user to freely write the second character as
   * a "normal" rune prompt
   * @method writeDemoChar2
   */
  writeDemoChar2: function () {
    this.setDemoProgress('writeDemoChar2', true);

    this.prompt.part.eraseCharacter();
    this.prompt.review.set('score', 3);
    this.prompt.$('#toolbar-action-container').show();

    this.prompt.once('character:complete', this.teachEraseDemoChar1);
  },

  /**
   * Step that teaches users how to use the erase characters from the prompt
   */
  teachEraseDemoChar1: function () {
    vent.trigger('notification:show', {
        dialogTitle: 'Erasing Characters',
        showTitle: !app.isMobile(),
        keepAlive: true,
        body: this.parseTemplate(require('./notify-erase-character1.jade')),
        style: {
          dialog: {
            top: app.isMobile() ? '49px' : '20%',
            height: app.isMobile() ? '162px' : 'auto',
            left: app.isMobile() ? '0px' : '50%',
            width: app.isMobile() ? '100%' : '50%',
          },
          backdrop: {
            height: app.isMobile() ? '0px' : 'auto',
            left: app.isMobile() ? '0px' : '50%',
          },
        },
    });

    this.setDemoProgress('erasingCharacters');

    const eraseBtn = $('.icon-study-erase');
    const eraseBtnPos = eraseBtn.offset();
    const eraseBtnWidth = Math.round(eraseBtn.width() / 2);
    const eraseBtnHeight = Math.round(eraseBtn.width() / 2);

    if (app.isMobile()) {
      vent.trigger('callToActionGuide:toggle', true, {
        left: '40%',
        top: 'auto',
      });

      $('#app-call-to-action-guide').addClass('show-erase-swipe-animation');
    } else {
      const popupTopPos = eraseBtnPos ? (eraseBtnPos.top - eraseBtnHeight) : 0;
      const popupLeftPos = eraseBtnPos ? (eraseBtnPos.left - eraseBtnWidth) : 0;
      const popupSize = app.isMobile() ? 'auto' : (eraseBtnHeight * 4) + 'px';

      vent.trigger('callToActionGuide:toggle', true, {
        top: popupTopPos + 'px',
        left: popupLeftPos + 'px',
        width: popupSize,
        height: popupSize,
      });
    }

    _.defer(() => {
      this.$('.tap-to-advance-wrapper').addClass('hidden');
      this.prompt.toolbarAction.$view.removeClass('hidden');
    });

    this.prompt.once('character:erased', this.teachEraseDemoChar2);
  },

  /**
   * Step that responds to a user erasing a character
   * @method teachEraseDemoChar2
   */
  teachEraseDemoChar2: function () {
    vent.trigger('notification:show', {
      dialogTitle: 'Erasing Characters',
      showTitle: !app.isMobile(),
      keepAlive: true,
      body: this.parseTemplate(require('./notify-erase-character2.jade')),
    });

    vent.trigger('callToActionGuide:toggle', false);

    this.prompt.once('character:complete', () => {
      this.prompt.review.set('score', 3);
      this.prompt.canvas.injectLayerColor(
        'character',
        this.prompt.review.getGradingColor()
      );

      _.defer(() => {
        this.$('#toolbar-action-container').hide();
      });

      this.$('.tap-to-advance-wrapper').removeClass('hidden');
      this.prompt.$('.grading-btn-wrapper').addClass('hidden');

      vent.trigger('notification:show', {
        dialogTitle: 'Different Prompts',
        showTitle: !app.isMobile(),
        keepAlive: true,
        body: this.parseTemplate(require('./notify-different-prompts.jade')),
      });
    });

    this.prompt.once('next', this.teachDefinitionPrompt1);
  },

  /**
   * Step that teaches users how to answer a definition prompt
   * @method teachDefinitionPrompt1
   */
  teachDefinitionPrompt1: function () {
    const defnItems = this.vocab.getPromptItems('defn');
    this.promptItems = defnItems;
    this.prompt.set(this.promptItems);

    vent.trigger('notification:show', {
      dialogTitle: 'Definition Prompts',
      showTitle: true,
      showConfirmButton: app.isMobile(),
      buttonText: 'Ok',
      keepAlive: true,
      body: this.parseTemplate(require('./notify-definition1.jade')),
      style: {
        backdrop: {
          top: app.isMobile() ? '49px' : '0%',
          left: app.isMobile() ? '0px' : '50%',
          height: '100%',
        },
        dialog: {
          top: '20%',
          left: app.isMobile() ? '0px' : '50%',
          width: app.isMobile() ? '100%' : '50%',
          height: 'auto',
        },
      },
    });
    this.setDemoProgress('definitionPrompts');

    this.prompt.$('#toolbar-action-container').show();

    this.prompt.review.once('change:complete', this.teachSRS1);
  },

  /**
   * Step that explains SRS and lets the user choose a grade for their prompt answer
   * @method teachSRS1
   */
  teachSRS1: function () {
    vent.trigger('notification:show', {
      dialogTitle: 'Spaced Repetition',
      showTitle: !app.isMobile(),
      keepAlive: true,
      body: this.parseTemplate(require('./notify-srs-1.jade')),
      style: {
        dialog: {
          top: app.isMobile() ? '49px' : '20%',
          height: app.isMobile() ? '215px' : 'auto',
          left: app.isMobile() ? '0px' : '50%',
          width: app.isMobile() ? '100%' : '50%',
        },
        backdrop: {
          height: app.isMobile() ? '0px' : 'auto',
          left: app.isMobile() ? '0px' : '50%',
        },
      },
    });
    this.setDemoProgress('spacedRepetition');

    this.prompt.$('#toolbar-action-container').hide();

    _.defer(() => {
      this.prompt.$('.grading-btn-wrapper').removeClass('hidden');
      this.prompt.toolbarGrading.once('grade:selected', () => {
        this.$('.tap-to-advance-wrapper').removeClass('hidden');
      });
    });

    this.prompt.once('next', () => {
      this.$('.grading-btn').off('click');
      this.prompt.$('#toolbar-action-container').show();
      this.prompt.$('.grading-btn-wrapper').addClass('hidden');

      if (this.lang === 'zh') {
        this.teachTonePrompt1();
      } else {
        this.teachReadingPrompt1();
      }
    });
  },

  /**
   * ZH-only step that teaches users how to answer a tone prompt
   * @method teachTonePrompt1
   */
  teachTonePrompt1: function () {
    const toneItems = this.vocab.getPromptItems('tone');
    this.promptItems = toneItems;
    this.prompt.set(this.promptItems);

    vent.trigger('notification:show', {
      dialogTitle: 'Tone Prompts',
      showTitle: true,
      keepAlive: true,
      buttonText: 'Ok',
      showConfirmButton: app.isMobile(),
      body: this.parseTemplate(require('./notify-tone1.jade')),
      style: {
        dialog: {
          top: '20%',
          left: app.isMobile() ? '0px' : '50%',
          width: app.isMobile() ? '100%' : '50%',
          height: 'auto',
        },
        backdrop: {
          height: '100%',
          left: app.isMobile() ? '0px' : '50%',
        },
      },
    });

    this.setDemoProgress('tonePrompts');

    this.prompt.once('tone:complete', () => {
      this.$('.tap-to-advance-wrapper').removeClass('hidden');
      this.prompt.$('#toolbar-action-container').hide();

      this.prompt.once('reviews:next', () => {
        this.prompt.$('#toolbar-action-container').show();
      });

      // this is a hack...there are two characters, let's just redo it again
      this.prompt.once('tone:complete', () => {
        this.$('.tap-to-advance-wrapper').removeClass('hidden');
        this.prompt.$('#toolbar-action-container').hide();
      });
    });

    this.prompt.once('next', this.teachReadingPrompt1);
  },

  /**
   * Step that teaches users how to answer a reading prompt
   * @method teachReadingPrompt1
   */
  teachReadingPrompt1: function () {
    const rdngItems = this.vocab.getPromptItems('rdng');
    this.promptItems = rdngItems;
    this.prompt.set(this.promptItems);

    vent.trigger('notification:show', {
      dialogTitle: 'Pronunciation Prompts',
      showTitle: true,
      keepAlive: true,
      buttonText: 'Ok',
      showConfirmButton: app.isMobile(),
      body: this.parseTemplate(require('./notify-reading1.jade')),
      style: {
        dialog: {
          top: '20%',
          left: app.isMobile() ? '0px' : '50%',
          width: app.isMobile() ? '100%' : '50%',
        },
      },
    });
    this.setDemoProgress('readingPrompts');

    this.prompt.$('#toolbar-action-container').show();

    if (this.lang === 'zh' && !app.isMobile()) {
      $('.modal').removeAttr('tabindex');
      _.defer(() => {
        $('#reading-prompt').focus();
      });
    }

    this.prompt.once('reading:complete', () => {
      this.$('.tap-to-advance-wrapper').removeClass('hidden');
      this.prompt.$('#toolbar-action-container').hide();
    });

    this.prompt.once('next', () => {
      this.completeDemo();
    });
  },

  /**
   * Sets up and shows the end of demo notifications to the user
   * @method completeDemo
   */
  completeDemo: function () {
    this.setDemoProgress('demoComplete');

    if (!this.prompt.review.isComplete()) {
      this.prompt.review.set('complete', true);
      this.prompt.renderPart();
    }

    if (app.isMobile() && !app.user.isLoggedIn()) {
      this._loggingInAnon = app.user.loginAnonymous();
    }

    const next = app.user.isLoggedIn() || app.isMobile() ? null : {
      showTitle: false,
      body: this.parseTemplate(require('./notify-demo-complete.jade')),
      showConfirmButton: false,
      style: {
        backdrop: {
          top: '0px',
          width: '100%',
          height: '100%',
        },
        dialog: {
          'top': app.isMobile() ? '49px' : '100px',
          'max-height': app.isMobile() ? 'calc(100% - 49px)' : 'calc(100% - 49px)',
          'width': '100%',
        },
      },
    };

    vent.trigger('notification:show', {
      dialogTitle: app.isMobile() ? 'Demo complete' : 'Lots of Features!',
      showTitle: true,
      keepAlive: true,
      body: this.parseTemplate(require('./notify-features1.jade')),
      buttonText: 'Ok',
      showConfirmButton: true,
      style: {
        backdrop: {
          top: '0px',
          width: '100%',
        },
        dialog: {
          'top': '20%',
          'left': app.isMobile() ? '0%' : 'auto',
          'width': '100%',
          'overflow-y': 'auto',
        },
      },
      next,
    });

    vent.once('notification:close', this.performPostDemoAction);
  },

  /**
   * Determines where the user should be navigated to based on the platform and
   * the user's login status.
   * @method performPostDemoAction
   */
  performPostDemoAction: function () {
    // redirect to dashboard or account setup based on authentication
    if (app.isMobile()) {
      if (this._loggingInAnon) {
        this._loggingInAnon.then(function() {
          app.router.navigateAccountSetup();
        });
      } else {
        app.router.navigateDashboard();
      }
      return;
    } else {
      // logged in users don't see the "magazine ad" for Skritter, just take them back to the dashboard
      if (app.user.isLoggedIn()) {
        app.router.navigateDashboard();
      }
    }
  },

  /**
   * Shows a popup that guides the user through the demo and
   * updates as the user progresses through it.
   */
  showDemoGuidePopup: function () {
    const mobile = app.isMobile();

    vent.trigger('notification:show', {
      dialogTitle: app.locale('pages.demo.firstCharactersTitle'),
      exitAnimation: 'fadeButton',
      showTitle: true,
      body: app.locale('pages.demo.firstCharactersBody' + this.lang),
      buttonText: 'Next',
      showConfirmButton: true,
      style: {
        backdrop: {
          top: '0px',
          height: '100%',
        },
        dialog: {
          top: '20%',
        },
      },
      next: {
        enterAnimation: 'slide-up',
        dialogTitle: app.locale('pages.demo.firstCharactersTitle'),
        showTitle: !mobile,
        body: app.locale('pages.demo.firstCharacters2Body' + this.lang),
        showConfirmButton: false,
        style: {
          dialog: {
            width: mobile ? 'auto' : '53%',
            left: mobile ? '0%' : '48%',
            top: mobile ? '49px' : '20%',
            height: mobile ? '145px' : 'auto',
          },
          backdrop: {
            left: mobile ? '0%' : '50%',
            width: mobile ? '100%' : '50%',
            top: mobile ? '49px': '0px',
            bottom: mobile ? 'inherit' : '0%',
            height: mobile ? '0%' : 'auto',
            opacity: mobile ? 0 : '0.5',
          },
        },
      },
    });
  },

  /**
   * Records the user's progress through the demo
   * @param {String} step the id of the current step
   * @param {Boolean} [silent] whether to send analytics without triggering an event
   */
  setDemoProgress: function (step, silent) {
    if (!silent) {
      this.trigger('step:update', step);
    }

    if (!app.isDevelopment() && !app.user.isLoggedIn()) {
      const platformData = {
        client: app.isAndroid() ? 'android' : 'web',
        lang: this.lang,
        version: app.config.version,
        uuid: localStorage.getItem('skrit-uuid'),
        step,
      };

      $.ajax({
        url: app.getApiUrl(2) + 'usage/demo',
        type: 'POST',
        headers: app.user.session.getHeaders(),
        data: platformData,
        error: function (error) {},
        success: function () {},
      });
    }
  },

  /**
   * @method remove
   * @returns {DemoPage}
   */
  remove: function () {
    this.prompt.remove();
    this.prompt = null;

    return GelatoPage.prototype.remove.call(this);
  },
});

module.exports = DemoPage;
