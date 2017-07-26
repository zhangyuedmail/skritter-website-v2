const GelatoPage = require('gelato/page');
const Vocabs = require('collections/VocabCollection');
const Prompt = require('components/study/prompt/StudyPromptComponent.js');
const DemoCallToActionDialog = require('dialogs1/demo-complete/DemoCompleteDialog.js');
const DemoLanguageSelectDialog = require('dialogs1/demo-language-select/view');
const DemoProgressComponent = require('components/demo/DemoProgressComponent.js');
const ItemsCollection = require('collections/ItemCollection');
const vent = require('vent');

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

  navbarOptions: {
    showBackBtn: true
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
    _.bindAll(this, 'teachDemoChar1','teachDemoChar2', 'writeDemoChar1',
      'writeDemoChar2', 'completeDemo', 'switchToWriting', 'teachEraseDemoChar1',
      'teachDefinitionPrompt1', 'teachEraseDemoChar2', 'teachReadingPrompt1',
      'teachTonePrompt1', 'teachSRS1');

    this.useNewDemo = app.isDevelopment();

    this.dialog = null;
    this.lang = 'zh';
    this.notify = null;
    this.prompt = new Prompt({
      page: this,
      isDemo: true,
      showTapToAdvanceText: true,
      showGradingButtons: false
    });
    this.promptItems = null;
    this.vocab = null;
    this.vocabs = new Vocabs();
    this.items = new ItemsCollection();

    if (this.useNewDemo) {
      this._views['progress'] = new DemoProgressComponent({
        demoPage: this,
        firstStep: 'languageSelection'
      });
      this.listenTo(this._views['progress'], 'demo:skip', this.completeDemo);
    }

    this.setDemoProgress('languageSelection');
  },

  /**
   * @method render
   * @returns {DemoPage}
   */
  render: function() {
    this.renderTemplate();
    this.prompt.setElement('#demo-prompt-container').render();

    if (this._views['progress']) {
      this.$('#progress-container').html(this._views['progress'].render().el)
    }
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
          let vocabDataZh = {"Vocabs":[{"lang":"zh","priority":0,"style":"both","audio":"http://storage.googleapis.com/skritter_audio/zh/cpod/6364231618265088.mp3","toughness":1,"sentenceIds":[],"dictionaryLinks":{"you-dao":"http://dict.youdao.com/search?q=%E4%BD%A0%E5%A5%BD&keyfrom=dict.index","mdbg":"http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=0&wdqb=%E4%BD%A0%E5%A5%BD","yellow-bridge":"http://www.yellowbridge.com/chinese/dictionary.php?word=%E4%BD%A0%E5%A5%BD","chinesepod":"http://chinesepod.com/tools/glossary/entry/%E4%BD%A0%E5%A5%BD","zdic":"","hanzicraft":"http://www.hanzicraft.com/character/%E4%BD%A0%E5%A5%BD","tatoeba-zh":"http://tatoeba.org/eng/sentences/search?query=%E4%BD%A0%E5%A5%BD&from=cmn&to=und","tw-moe":"https://www.moedict.tw/%E4%BD%A0%E5%A5%BD"},"bannedParts":[],"ilk":"word","writing":"\u4f60\u597d","audios":[{"source":"cpod","reading":"ni3hao3","mp3":"http://storage.googleapis.com/skritter_audio/zh/cpod/6364231618265088.mp3","writing":null,"id":"6364231618265088"}],"containedVocabIds":["zh-\u4f60-0","zh-\u597d-0"],"audioURL":"http://storage.googleapis.com/skritter_audio/zh/cpod/6364231618265088.mp3","toughnessString":"easiest","definitions":{"en":"hello; how do you do"},"starred":false,"reading":"ni3hao3","id":"zh-\u4f60\u597d-0","sentenceId":"zh-\u665a\u4e0a\u597d\u4f60\u597d\u5417-0"}],"statusCode":200,"Decomps":[],"Sentences":[{"lang":"zh","sentenceIds":[],"style":"simp","toughness":9,"creator":"Tatoeba","segmentation":{"readingFillers":[""," ",", "," ","?"],"reading":"Wan3shang5 hao3, ni3hao3 ma5?","wordWritings":["\u665a\u4e0a","\u597d","\u4f60\u597d","\u5417"],"writing":"\u665a\u4e0a\u597d\uff0c\u4f60\u597d\u5417\uff1f","wordVocabVotes":[3,5,5,42,0,0],"wordReadings":["wan3shang5","hao3","ni3hao3","ma5"],"wordVocabIds":["zh-\u665a\u4e0a-0","zh-\u597d-0","zh-\u4f60\u597d-0","zh-\u5417-0"],"overallVotes":55,"writingFillers":["","","\uff0c","","\uff1f"]},"bannedParts":[],"ilk":"sent","writing":"\u665a\u4e0a\u597d\uff0c\u4f60\u597d\u5417\uff1f","dictionaryLinks":{"you-dao":"http://dict.youdao.com/search?q=%E6%99%9A%E4%B8%8A%E5%A5%BD%E4%BD%A0%E5%A5%BD%E5%90%97&keyfrom=dict.index","mdbg":"http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=0&wdqb=%E6%99%9A%E4%B8%8A%E5%A5%BD%E4%BD%A0%E5%A5%BD%E5%90%97","yellow-bridge":"http://www.yellowbridge.com/chinese/dictionary.php?word=%E6%99%9A%E4%B8%8A%E5%A5%BD%E4%BD%A0%E5%A5%BD%E5%90%97","chinesepod":"http://chinesepod.com/tools/glossary/entry/%E6%99%9A%E4%B8%8A%E5%A5%BD%E4%BD%A0%E5%A5%BD%E5%90%97","zdic":"","hanzicraft":"http://www.hanzicraft.com/character/%E6%99%9A%E4%B8%8A%E5%A5%BD%E4%BD%A0%E5%A5%BD%E5%90%97","tatoeba-zh":"http://tatoeba.org/eng/sentences/search?query=%E6%99%9A%E4%B8%8A%E5%A5%BD%E4%BD%A0%E5%A5%BD%E5%90%97&from=cmn&to=und","tw-moe":"https://www.moedict.tw/%E6%99%9A%E4%B8%8A%E5%A5%BD%E4%BD%A0%E5%A5%BD%E5%90%97"},"containedVocabIds":["zh-\u665a-0","zh-\u4e0a-0","zh-\u597d-0","zh-\u4f60-0","zh-\u597d-0","zh-\u5417-0"],"toughnessString":"hardest","definitions":{"en":"Good evening, how are you?"},"starred":false,"reading":"Wan3shang5 hao3, ni3hao3 ma5?","id":"zh-\u665a\u4e0a\u597d\u4f60\u597d\u5417-0"}]};
          let vocabDataJa = {"Vocabs":[{"lang":"ja","rareKanji":false,"sentenceId":"ja-\u3061\u3087\u3063\u3068\u5143\u6c17\u304c\u306a\u3044\u3067\u3059-0","audio":"http://storage.googleapis.com/skritter_audio/ja/kaori/6311145470164992.mp3","toughness":4,"sentenceIds":[],"dictionaryLinks":{"wwwjdic":"http://nihongo.monash.edu/cgi-bin/wwwjdic?1MMJ%E5%85%83%E6%B0%97","jisho":"http://jisho.org/words?jap=%E5%85%83%E6%B0%97","goo":"http://dictionary.goo.ne.jp/srch/je/%E5%85%83%E6%B0%97/m0u/","weblio":"http://ejje.weblio.jp/content/%E5%85%83%E6%B0%97","alc":"http://eow.alc.co.jp/%E5%85%83%E6%B0%97/UTF-8/"},"bannedParts":[],"ilk":"word","writing":"\u5143\u6c17","audios":[{"source":"kaori","reading":"\u3052\u3093\u304d","mp3":"http://storage.googleapis.com/skritter_audio/ja/kaori/6311145470164992.mp3","writing":"\u5143\u6c17","id":"6311145470164992"}],"containedVocabIds":["ja-\u5143-0","ja-\u6c17-0"],"audioURL":"http://storage.googleapis.com/skritter_audio/ja/kaori/6311145470164992.mp3","toughnessString":"medium","definitions":{"en":"healthy; energetic"},"starred":false,"reading":"\u3052\u3093\u304d","id":"ja-\u5143\u6c17-0"}],"statusCode":200,"Decomps":[],"Sentences":[{"lang":"ja","rareKanji":false,"segmentation":{"readingFillers":["","","","","",""],"reading":"\u3061\u3087\u3063\u3068\u3052\u3093\u304d\u304c\u306a\u3044\u3067\u3059\u3002","wordWritings":["\u3061\u3087\u3063\u3068","\u5143\u6c17","\u304c\u306a\u3044","\u3067\u3059","\u3002"],"writing":"\u3061\u3087\u3063\u3068\u5143\u6c17\u304c\u306a\u3044\u3067\u3059\u3002","wordVocabVotes":[0,0,0,0,0],"wordReadings":["\u3061\u3087\u3063\u3068","\u3052\u3093\u304d","\u304c\u306a\u3044","\u3067\u3059","\u3002"],"wordVocabIds":["ja-\u3061\u3087\u3063\u3068-0","ja-\u5143\u6c17-0","","ja-\u3067\u3059-0",""],"overallVotes":5,"writingFillers":["","","","","",""]},"toughness":47,"creator":"g1itch","dictionaryLinks":{"wwwjdic":"http://nihongo.monash.edu/cgi-bin/wwwjdic?1MMJ%E3%81%A1%E3%82%87%E3%81%A3%E3%81%A8%E5%85%83%E6%B0%97%E3%81%8C%E3%81%AA%E3%81%84%E3%81%A7%E3%81%99","jisho":"http://jisho.org/words?jap=%E3%81%A1%E3%82%87%E3%81%A3%E3%81%A8%E5%85%83%E6%B0%97%E3%81%8C%E3%81%AA%E3%81%84%E3%81%A7%E3%81%99","goo":"http://dictionary.goo.ne.jp/srch/je/%E3%81%A1%E3%82%87%E3%81%A3%E3%81%A8%E5%85%83%E6%B0%97%E3%81%8C%E3%81%AA%E3%81%84%E3%81%A7%E3%81%99/m0u/","weblio":"http://ejje.weblio.jp/content/%E3%81%A1%E3%82%87%E3%81%A3%E3%81%A8%E5%85%83%E6%B0%97%E3%81%8C%E3%81%AA%E3%81%84%E3%81%A7%E3%81%99","alc":"http://eow.alc.co.jp/%E3%81%A1%E3%82%87%E3%81%A3%E3%81%A8%E5%85%83%E6%B0%97%E3%81%8C%E3%81%AA%E3%81%84%E3%81%A7%E3%81%99/UTF-8/"},"bannedParts":[],"created":1374776549,"ilk":"sent","writing":"\u3061\u3087\u3063\u3068\u5143\u6c17\u304c\u306a\u3044\u3067\u3059\u3002","containedVocabIds":["ja-\u5143-0","ja-\u6c17-0"],"sentenceIds":[],"toughnessString":"unknown","definitions":{"en":"I feel a bit down."},"starred":false,"reading":"\u3061\u3087\u3063\u3068\u3052\u3093\u304d\u304c\u306a\u3044\u3067\u3059\u3002","id":"ja-\u3061\u3087\u3063\u3068\u5143\u6c17\u304c\u306a\u3044\u3067\u3059-0"}]};

          if (self.useNewDemo) {
            vocabDataZh = {"Vocabs":[{"lang":"zh","sentenceIds":[],"style":"both","audio":"http://storage.googleapis.com/skritter_audio/zh/cpod/4920340100677632.mp3","toughness":2,"creator":"CPAPI","dictionaryLinks":{"you-dao":"http://dict.youdao.com/search?q=%E4%B8%AD%E6%96%87&keyfrom=dict.index","mdbg":"http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=0&wdqb=%E4%B8%AD%E6%96%87","yellow-bridge":"http://www.yellowbridge.com/chinese/dictionary.php?word=%E4%B8%AD%E6%96%87","chinesepod":"http://chinesepod.com/tools/glossary/entry/%E4%B8%AD%E6%96%87","zdic":"","hanzicraft":"http://www.hanzicraft.com/character/%E4%B8%AD%E6%96%87","tatoeba-zh":"http://tatoeba.org/eng/sentences/search?query=%E4%B8%AD%E6%96%87&from=cmn&to=und","tw-moe":"https://www.moedict.tw/%E4%B8%AD%E6%96%87"},"bannedParts":[],"created":1281392448,"ilk":"word","writing":"\u4e2d\u6587","audios":[{"source":"cpod","reading":"zhong1wen2","mp3":"http://storage.googleapis.com/skritter_audio/zh/cpod/4920340100677632.mp3","writing":null,"id":"4920340100677632"},{"source":"tan","reading":"zhong1wen2","mp3":"http://storage.googleapis.com/skritter_audio/zh/tan/5250798843854848.mp3","writing":null,"id":"5250798843854848"}],"containedVocabIds":["zh-\u4e2d-0","zh-\u6587-0"],"audioURL":"http://storage.googleapis.com/skritter_audio/zh/cpod/4920340100677632.mp3","toughnessString":"easier","definitions":{"en":"Chinese (language)"},"starred":false,"reading":"Zhong1wen2","id":"zh-\u4e2d\u6587-0","sentenceId":"zh-\u6211\u5b66\u4e60\u4e2d\u6587-0"}],"statusCode":200,"Decomps":[],"Sentences":[{"lang":"zh","sentenceIds":[],"style":"simp","toughness":8,"creator":"Hutongschool","segmentation":{"readingFillers":[""," "," ",""],"reading":"wo3 xue2xi2 Zhong1wen2","wordWritings":["\u6211","\u5b66\u4e60","\u4e2d\u6587"],"writing":"\u6211 \u5b66\u4e60 \u4e2d\u6587","wordVocabVotes":[0,4,8],"wordReadings":["wo3","xue2xi2","Zhong1wen2"],"wordVocabIds":["zh-\u6211-0","zh-\u5b66\u4e60-0","zh-\u4e2d\u6587-0"],"overallVotes":20,"writingFillers":["","","",""]},"bannedParts":[],"created":1373960687,"ilk":"sent","writing":"\u6211 \u5b66\u4e60 \u4e2d\u6587","dictionaryLinks":{"you-dao":"http://dict.youdao.com/search?q=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87&keyfrom=dict.index","mdbg":"http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=0&wdqb=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87","yellow-bridge":"http://www.yellowbridge.com/chinese/dictionary.php?word=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87","chinesepod":"http://chinesepod.com/tools/glossary/entry/%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87","zdic":"","hanzicraft":"http://www.hanzicraft.com/character/%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87","tatoeba-zh":"http://tatoeba.org/eng/sentences/search?query=%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87&from=cmn&to=und","tw-moe":"https://www.moedict.tw/%E6%88%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E6%96%87"},"containedVocabIds":["zh-\u6211-0","zh-\u5b66-0","zh-\u4e60-0","zh-\u4e2d-0","zh-\u6587-0"],"toughnessString":"harder","definitions":{"en":"I study Chinese."},"starred":false,"reading":"wo3 xue2xi2 Zhong1wen2","id":"zh-\u6211\u5b66\u4e60\u4e2d\u6587-0"}]};
            vocabDataJa = {"Vocabs":[{"lang":"ja","rareKanji":false,"sentenceId":"ja-\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059-0","audio":"http://storage.googleapis.com/skritter_audio/ja/kaori/4862201342984192.mp3","toughness":2,"sentenceIds":[],"dictionaryLinks":{"wwwjdic":"http://nihongo.monash.edu/cgi-bin/wwwjdic?1MMJ%E6%97%A5%E6%9C%AC","jisho":"http://jisho.org/words?jap=%E6%97%A5%E6%9C%AC","goo":"http://dictionary.goo.ne.jp/srch/je/%E6%97%A5%E6%9C%AC/m0u/","weblio":"http://ejje.weblio.jp/content/%E6%97%A5%E6%9C%AC","alc":"http://eow.alc.co.jp/%E6%97%A5%E6%9C%AC/UTF-8/"},"bannedParts":[],"creator":"mtaran","ilk":"word","writing":"\u65e5\u672c","audios":[{"source":"kaori","reading":"\u306b\u307b\u3093","mp3":"http://storage.googleapis.com/skritter_audio/ja/kaori/4862201342984192.mp3","writing":"\u65e5\u672c","id":"4862201342984192"},{"source":"kaori","reading":"\u306b\u3063\u307d\u3093","mp3":"http://storage.googleapis.com/skritter_audio/ja/kaori/4974911622742016.mp3","writing":"\u65e5\u672c","id":"4974911622742016"}],"created":1249318103,"containedVocabIds":["ja-\u65e5-0","ja-\u672c-0"],"audioURL":"http://storage.googleapis.com/skritter_audio/ja/kaori/4862201342984192.mp3","toughnessString":"easier","definitions":{"en":"Japan"},"starred":false,"reading":"\u306b\u307b\u3093, \u306b\u3063\u307d\u3093","id":"ja-\u65e5\u672c-0"}],"statusCode":200,"Decomps":[],"Sentences":[{"lang":"ja","rareKanji":false,"segmentation":{"readingFillers":["","","","","","","",""],"reading":"\u3044\u3051\u3070\u306a\u306f\u306b\u3063\u307d\u3093\u306e\u3076\u3093\u304b\u3067\u3059\u3002","wordWritings":["\u751f\u3051\u82b1","\u306f","\u65e5\u672c","\u306e","\u6587\u5316","\u3067\u3059","\u3002"],"writing":"\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059\u3002","wordVocabVotes":[0,0,0,0,0,0,0],"wordReadings":["\u3044\u3051\u3070\u306a","\u306f","\u306b\u3063\u307d\u3093","\u306e","\u3076\u3093\u304b","\u3067\u3059","\u3002"],"wordVocabIds":["ja-\u751f\u3051\u82b1-0","ja-\u306f-1","ja-\u65e5\u672c-0","ja-\u306e-0","ja-\u6587\u5316-0","ja-\u3067\u3059-0",""],"overallVotes":6,"writingFillers":["","","","","","","",""]},"toughness":42,"creator":"Tatoeba","dictionaryLinks":{"wwwjdic":"http://nihongo.monash.edu/cgi-bin/wwwjdic?1MMJ%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99","jisho":"http://jisho.org/words?jap=%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99","goo":"http://dictionary.goo.ne.jp/srch/je/%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99/m0u/","weblio":"http://ejje.weblio.jp/content/%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99","alc":"http://eow.alc.co.jp/%E7%94%9F%E3%81%91%E8%8A%B1%E3%81%AF%E6%97%A5%E6%9C%AC%E3%81%AE%E6%96%87%E5%8C%96%E3%81%A7%E3%81%99/UTF-8/"},"bannedParts":[],"ilk":"sent","writing":"\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059\u3002","containedVocabIds":["ja-\u751f-0","ja-\u82b1-0","ja-\u65e5-0","ja-\u672c-0","ja-\u6587-0","ja-\u5316-0"],"sentenceIds":[],"toughnessString":"unknown","definitions":{"en":"Flower arrangement is a part of Japanese culture."},"starred":false,"reading":"\u3044\u3051\u3070\u306a\u306f\u306b\u3063\u307d\u3093\u306e\u3076\u3093\u304b\u3067\u3059\u3002","id":"ja-\u751f\u3051\u82b1\u306f\u65e5\u672c\u306e\u6587\u5316\u3067\u3059-0"}]};
          }

          self.vocabs.add(lang === 'zh' ? vocabDataZh.Vocabs : vocabDataJa.Vocabs);
          app.set('demoLang', lang);
          app.user.set('targetLang', lang);
          self.vocab = self.vocabs.at(0);
          callback(null, self.vocab);
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
        if (self.useNewDemo) {
          const runeItems = vocab.getPromptItems('rune');
          self.promptItems = runeItems;
        } else {
          self.promptItems = vocab.getPromptItems('rune');
        }
        self.promptItems.teachAll();

        // uncomment for faster testing shortcut
        // self.teachTonePrompt1();
        self.teachDemoChar1();
      }
    );
  },

  /**
   * Step that teaches users how to use the erase characters from the prompt
   */
  teachEraseDemoChar1: function() {
    vent.trigger('notification:show', {
        dialogTitle: 'Erasing Characters',
        showTitle: true,
        keepAlive: true,
        body: this.parseTemplate(require('./notify-erase-character1.jade'))
      });

    this.setDemoProgress('erasingCharacters');

    const eraseBtn = $('.icon-study-erase');
    const eraseBtnPos = eraseBtn.offset();
    const eraseBtnWidth = Math.round(eraseBtn.width() / 2);
    const eraseBtnHeight = Math.round(eraseBtn.width() / 2);

    if (app.isMobile()) {
      // TODO: repeating swipe up motion
    } else {
      const popupTopPos = eraseBtnPos ? (eraseBtnPos.top - eraseBtnHeight) : 0;
      const popupLeftPos = eraseBtnPos ? (eraseBtnPos.left - eraseBtnWidth) : 0;
      const popupSize = app.isMobile() ? 'auto' : (eraseBtnHeight * 4) + 'px';

      vent.trigger('callToActionGuide:toggle', true, {
        top: popupTopPos + 'px',
        left: popupLeftPos + 'px',
        width: popupSize,
        height: popupSize
      });
    }

    this.prompt.once('character:erased', this.teachEraseDemoChar2);
  },

  /**
   * Step that responds to a user erasing a character
   */
  teachEraseDemoChar2: function() {
    vent.trigger('notification:show', {
      dialogTitle: 'Erasing Characters',
      showTitle: true,
      keepAlive: true,
      body: this.parseTemplate(require('./notify-erase-character2.jade'))
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
        showTitle: true,
        keepAlive: true,
        body: this.parseTemplate(require('./notify-different-prompts.jade'))
      });
    });

    this.prompt.once('next', this.teachDefinitionPrompt1);
  },

  /**
   * Step that teaches users how to answer a definition prompt
   */
  teachDefinitionPrompt1: function() {
    const defnItems = this.vocab.getPromptItems('defn');
    this.promptItems = defnItems;
    this.prompt.set(this.promptItems);

    vent.trigger('notification:show', {
      dialogTitle: 'Definition Prompts',
      showTitle: true,
      keepAlive: true,
      body: this.parseTemplate(require('./notify-definition1.jade'))
    });
    this.setDemoProgress('definitionPrompts');

    this.prompt.$('#toolbar-action-container').show();

    this.prompt.review.once('change:complete', this.teachSRS1);
  },

  teachSRS1: function() {
    vent.trigger('notification:show', {
      dialogTitle: 'Spaced Repetition',
      showTitle: true,
      keepAlive: true,
      body: this.parseTemplate(require('./notify-srs-1.jade'))
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
   * @method step1
   */
  teachDemoChar1: function() {
    if (!this.useNewDemo) {
      this.prompt.tutorial.show();
      this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step1')));
    }

    this.prompt.set(this.promptItems);
    this.prompt.shortcuts.unregisterAll();
    this.prompt.$('#navigation-container').hide();
    this.prompt.$('#toolbar-action-container').hide();
    this.prompt.$('#toolbar-vocab-container').hide();
    this.prompt.once('character:complete', this.teachDemoChar2);

    this.setDemoProgress('teachDemoChar1');

    if (this.useNewDemo) {
      this.showDemoGuidePopup();
    }
  },

  /**
   * @method step3
   */
  teachDemoChar2: function() {
    app.mixpanel.track('Completed tracing demo character #1');
    this.setDemoProgress('teachDemoChar2', true);

    if (!this.useNewDemo) {
      this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step3')));
    }

    this.prompt.$('#toolbar-action-container').hide();
    this.prompt.once('next', this.writeDemoChar1);
  },

  /**
   * Step that teaches users how to answer a reading prompt
   */
  teachReadingPrompt1: function() {
    const rdngItems = this.vocab.getPromptItems('rdng');
    this.promptItems = rdngItems;
    this.prompt.set(this.promptItems);

    vent.trigger('notification:show', {
      dialogTitle: 'Pronunciation Prompts',
      showTitle: true,
      keepAlive: true,
      body: this.parseTemplate(require('./notify-reading1.jade'))
    });
    this.setDemoProgress('readingPrompts');

    this.prompt.$('#toolbar-action-container').show();

    if (this.lang === 'zh' && !app.isMobile()) {
      // this.$('.reading-prompt').removeClass('hidden');
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
   * Step that teaches users how to answer a reading prompt
   */
  teachTonePrompt1: function() {
    const toneItems = this.vocab.getPromptItems('tone');
    this.promptItems = toneItems;
    this.prompt.set(this.promptItems);

    vent.trigger('notification:show', {
      dialogTitle: 'Tone Prompts',
      showTitle: true,
      keepAlive: true,
      body: this.parseTemplate(require('./notify-tone1.jade'))
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
   * Erases the characters and goes back to the beginning of the review
   */
  switchToWriting: function() {
    this.prompt.part.eraseCharacter();
    this.prompt.previous();
    this.prompt.review.set('score', 3);
    this.prompt.part.eraseCharacter();
    this.$('#study-prompt-toolbar-action').hide();

    if (this.useNewDemo) {
      vent.trigger('notification:show', {
        dialogTitle: 'Getting Hints',
        showTitle: true,
        keepAlive: true,
        body: this.parseTemplate(require('./notify-step2'))
      });
    }
  },

  /**
   * @method step2
   */
  writeDemoChar1: function() {
    this.switchToWriting();
    app.mixpanel.track('Completed tracing demo character #2');
    this.setDemoProgress('writeDemoChar1');

    if (!this.useNewDemo) {
      this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step2')));
    }

    this.prompt.review.set('score', 3);
    this.prompt.$('#toolbar-action-container').show();

    this.prompt.once('character:complete', () => {
        this.$('.tap-to-advance-wrapper').removeClass('hidden');
        this.prompt.$('.grading-btn-wrapper').addClass('hidden');
    });
    this.prompt.once('reviews:next', this.writeDemoChar2);
  },

  /**
   * @method step4
   */
  writeDemoChar2: function() {
    app.mixpanel.track('Completed writing demo character #1');
    this.setDemoProgress('writeDemoChar2', true);

    if (!this.useNewDemo) {
      this.prompt.tutorial.setMessage(this.parseTemplate(require('./notify-step4')));
    }

    this.prompt.part.eraseCharacter();
    this.prompt.review.set('score', 3);
    this.prompt.$('#toolbar-action-container').show();

    if (this.useNewDemo) {
      this.prompt.once('character:complete', this.teachEraseDemoChar1);
    } else {
      this.prompt.once('character:complete', this.completeDemo);
    }
  },

  /**
   * @method step5
   */
  completeDemo: function() {
    app.mixpanel.track('Completed writing demo character #2');
    this.setDemoProgress('demoComplete');

    if (this.useNewDemo) {
      if (!this.prompt.review.isComplete()) {
        this.prompt.review.set('complete', true);
        this.prompt.renderPart();
      }

      vent.trigger('notification:show', {
        dialogTitle: 'Lots of Features!',
        showTitle: true,
        keepAlive: true,
        body: this.parseTemplate(require('./notify-features1.jade')),
        buttonText: 'Ok',
        showConfirmButton: true,
        style: {
          backdrop: {
            top: '90px',
            width: '50%'
          },
          dialog: {
            top: '100px',
            width: '50%'
          }
        },
        next: {
          // dialogTitle: 'Demo Complete',
          showTitle: false,
          body: this.parseTemplate(require('./notify-demo-complete.jade')),
          showConfirmButton: false,
          style: {
            backdrop: {
              top: '90px',
              width: '100%'
            },
            dialog: {
              top: '100px',
              width: '100%'
            }
          }
        }
      });
    } else {
      this.dialog = new DemoCallToActionDialog();
      this.dialog.open();
    }
  },

  /**
   * Shows a popup that guides the user through the demo and
   * updates as the user progresses through it.
   */
  showDemoGuidePopup: function() {
    const mobile = app.isMobile();

    vent.trigger('notification:show', {
      dialogTitle: app.locale('pages.demo.firstCharactersTitle'),
      showTitle: true,
      body: app.locale('pages.demo.firstCharactersBody' + this.lang),
      buttonText: 'Next',
      showConfirmButton: true,
      style: {
        backdrop: {
          top: '90px'
        },
        dialog: {
          top: '20%'
        }
      },
      next: {
        dialogTitle: app.locale('pages.demo.firstCharactersTitle'),
        showTitle: true,
        body: app.locale('pages.demo.firstCharacters2Body' + this.lang),
        showConfirmButton: false,
        style: {
          dialog: {
            width: mobile ? 'auto' : '53%',
            left: mobile ? '0%' : '48%',
            top: mobile ? '1%' : '20%',
            height: mobile ? '19%' : 'auto'
          },
          backdrop: {
            left: mobile ? '0%' : '50%',
            width: mobile ? '100%' : '50%',
            top: '90px',
            bottom: mobile ? 'auto' : '0%',
            height: mobile ? '150px' : 'auto'
          }
        }
      }
    });
  },

  /**
   * Records the user's progress through the demo
   * @param {String} step the id of the current step
   * @param {Boolean} [silent] whether to send analytics without triggering an event
   */
  setDemoProgress: function(step, silent) {
    if (!silent) {
      this.trigger('step:update', step);
    }

    if (!app.isDevelopment() && !app.user.isLoggedIn()) {
      const platformData = {
        client: app.isAndroid() ? 'android' : 'web',
        lang: this.lang,
        version: app.config.version,
        uuid: localStorage.getItem('skrit-uuid'),
        step
      };

      $.ajax({
        url: app.getApiUrl(2) + 'usage/demo',
        type: 'POST',
        headers: app.user.session.getHeaders(),
        data: platformData,
        error: function(error) {},
        success: function() {}
      });
    }
  },

  /**
   * @method remove
   * @returns {DemoPage}
   */
  remove: function() {
    this.prompt.remove();

    return GelatoPage.prototype.remove.call(this);
  }
});

module.exports = DemoPage;
