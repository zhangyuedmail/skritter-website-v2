const GelatoPage = require('gelato/page');
const Prompt = require('components/prompt/StudyPromptComponent.js');
const Toolbar = require('components/practice/toolbar/PracticePadToolbarComponent.js');
const ItemCollection = require('collections/ItemCollection');
const VocabCollection = require('collections/VocabCollection');

/**
 * @class PracticePadPage
 * @extends {GelatoPage}
 */
const PracticePadPage = GelatoPage.extend({

  /**
   * @property showFooter
   * @type {Boolean}
   */
  showFooter: false,

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Practice.jade'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Practice - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize (options) {
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
      this.loadAlreadyTimed = false;
    }

    _.bindAll(this, '_onInitialVocabDataLoaded');
    this.targetLang = options.targetLang;

    const vocabRuneString = options.vocabRunes || '';
    this.charactersToLoad = vocabRuneString.split(',').filter((v) => {
      return v && v.length;
    });
    this.idsToLoad = this.getVocabIdListFromRuneList(this.charactersToLoad);

    Howler.autoSuspend = false;

    ScreenLoader.show(true);

    this.currentItem = null;
    this.currentPromptItems = null;
    this.previousItem = null;
    this.previousPrompt = false;
    this.previousPromptItems = null;

    // TODO: nix this
    this.items = new ItemCollection();
    this.vocabs = new VocabCollection();

    this._views['prompt'] = new Prompt({
      page: this,
      showGradingButtons: false,
      vocabToolbarButtonState: {
        showAudio: true,
        showBan: false,
        showInfo: false,
        showStar: false,
      },
      actionToolbarButtonState: {
        teach: true,
        erase: true,
        show: true,
        correct: false,
        disableCorrect: true,
      },
    });
    this._views['toolbar'] = new Toolbar({
      page: this,
    });

    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);

    // handle specific cordova related events
    document.addEventListener('pause', this.handlePauseEvent.bind(this), false);
  },

  /**
   * @method render
   * @returns {PracticePadPage}
   */
  render () {
    if (app.isMobile()) {
      this.template = require('./MobilePractice.jade');
    }

    this.renderTemplate();
    this._views['prompt'].setElement('#study-prompt-container').render();
    this._views['toolbar'].setElement('#study-toolbar-container').render();

    if (this.idsToLoad.length) {
      this.loadInitialVocab();
    } else {
      this.showLoadVocabDialog();
    }

    return this;
  },

  /**
   * @method loadInitialVocab
   */
  loadInitialVocab () {
    ScreenLoader.post('Preparing practice');
    const self = this;

    this._fetchListOfVocabs(this.idsToLoad).then(() => {
      this._fetchContainedVocab((self.vocab.get('containedVocabIds') || []).join('|')).then(() => {
        this._fetchCharacters(self.vocab.get('lang'), self.vocab.get('writing')).then(this._onInitialVocabDataLoaded, this._onLoadError);
      }, this._onLoadError);
    }, this._onLoadError);
  },

  /**
   * Transforms a list of runes into Skritter vocab ids
   * @param vocabRunes
   */
  getVocabIdListFromRuneList (vocabRunes) {
    // TODO: actually parse this correctly
    return vocabRunes.map((v) => this.targetLang + '-' + v + '-0').join('|');
  },

  /**
   * @method handleItemPreload
   */
  handleItemPreload () {
    if (!this.currentPromptItems) {
      this.next();
    }
  },

  /**
   * @method handlePauseEvent
   */
  handlePauseEvent () {
    this.items.reviews.post(1);
  },

  /**
   * @method handlePromptNext
   * @param {PromptItemCollection} promptItems
   */
  handlePromptNext (promptItems) {
    this.items.reviews.put(promptItems.getReview());

    if (this.previousPrompt) {
      this.previousPrompt = false;
      this.next();

      return;
    }

    if (this.currentPromptItems) {
      this.currentItem._loaded = false;
      this.currentItem._queue = false;
      this.currentPromptItems = null;
      this.previousPromptItems = promptItems;

      this.next();
    }
  },

  /**
   * @method handlePromptPrevious
   * @param {PromptItemCollection} promptItems
   */
  handlePromptPrevious (promptItems) {
    this.previousPrompt = true;
    this.currentPromptItems = promptItems;
    this.previous();
  },

  /**
   * @method next
   */
  next () {
    const items = this.items.getNext();

    if (this.previousPrompt) {
      this.togglePromptLoading(false);
      this._views['prompt'].reviewStatus.render();
      this._views['prompt'].set(this.currentPromptItems);

      return;
    }

    if (items.length) {
      this.promptsReviewed++;
      this.promptsSinceLastAutoAdd++;

      this.currentItem = items[0];
      this.currentPromptItems = items[0].getPromptItems();
      this.togglePromptLoading(false);
      this._views['prompt'].reviewStatus.render();
      this._views['prompt'].set(this.currentPromptItems);

      ScreenLoader.hide();

      if (app.config.recordLoadTimes) {
        this._recordLoadTime();
      }

      return;
    }

    // disable things while preloading
    this.togglePromptLoading(true);
    this.items.preloadNext();
  },

  /**
   * @method previous
   */
  previous () {
    if (this.previousPromptItems) {
      this.togglePromptLoading(false);
      this._views['prompt'].reviewStatus.render();
      this._views['prompt'].set(this.previousPromptItems);
    }
  },

  /**
   * @method remove
   * @returns {PracticePadPage}
   */
  remove () {
    document.removeEventListener('pause', this.handlePauseEvent.bind(this), false);

    Howler.autoSuspend = true;

    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Shows a dialog that allows the user to pick vocab ids to load
   */
  showLoadVocabDialog () {
    console.log('TODO');
  },

  /**
   * Toggles the loading state on the canvas when fetching new items
   * @param {Boolean} loading whether the prompt is loading
   */
  togglePromptLoading (loading) {
    this._views['prompt'].toggleLoadingIndicator(loading);
  },

  /**
   * Loads character data for a set of runes in a target language
   * @param {String} languageCode 2-character code for the target language
   * @param {String} writings character runes to load
   */
  _fetchCharacters (languageCode, writings) {
    return new Promise((resolve, reject) => {
      app.user.characters.fetch({
        data: {
          languageCode,
          writings,
        },
        remove: false,
        error: function (error) {
          reject(error);
        },
        success: function () {
          resolve();
        },
      });
    });
  },

  /**
   * Fetches any contained vocab for a character
   * @param {String} ids contained character ids to load
   */
  _fetchContainedVocab (ids) {
    return new Promise((resolve, reject) => {
      if (this.vocab.has('containedVocabIds')) {
        this.vocabs.fetch({
          data: {
            include_decomps: true,
            include_sentences: true,
            ids,
          },
          remove: false,
          error: function (error) {
            reject(error);
          },
          success: function () {
            resolve();
          },
        });
      } else {
        resolve();
      }
    });
  },

  /**
   * Fetches a list of vocabs from a specified string of ids
   * @param {String} list a separated string of vocabs to fetch
   */
  _fetchListOfVocabs (list) {
    return new Promise((resolve, reject) => {
      this.vocabs.fetch({
        data: {
          include_decomps: true,
          include_heisigs: true,
          include_sentences: false,
          include_top_mnemonics: true,
          ids: this.idsToLoad,
        },
        error: (error) => {
          reject(error);
        },
        success: (vocabs) => {
          this.vocab = vocabs.at(0);
          resolve();
        },
      });
    });
  },

  /**
   * Handles a successful load of vocab data. Sets up the prompt and
   * hides the screenloader.
   */
  _onInitialVocabDataLoaded () {
    const runeItems = this.vocab.getPromptItems('rune');
    this.promptItems = runeItems;
    this._views['prompt'].set(this.promptItems);
    ScreenLoader.hide();
  },

  /**
   * Shows a loading error to the user on the ScreenLoader
   */
  _onLoadError (error) {
    let msg = 'Error fetching items. Please ';
    if (app.isMobile()) {
      msg += 'reload the application';
    } else {
      msg += 'refresh the page.';
    }
    ScreenLoader.post(msg);

    if (app.isDevelopment() && error) {
      console.error(error);
    }
  },

  /**
   * Records the load time for this page once.
   * @private
   */
  _recordLoadTime () {
    if (this.loadAlreadyTimed) {
      return;
    }

    this.loadAlreadyTimed = true;
    const loadTime = window.performance.now() - this.loadStart;
    app.loadTimes.pages.study.push(loadTime);
  },

});

module.exports = PracticePadPage;
