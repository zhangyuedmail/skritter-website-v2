const GelatoPage = require('gelato/page');
const Prompt = require('components/prompt/StudyPromptComponent.js');
const Toolbar = require('components/practice/toolbar/PracticePadToolbarComponent.js');
const ItemCollection = require('collections/ItemCollection');
const VocabCollection = require('collections/VocabCollection');
const vent = require('vent');

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
    this.charactersToLoad = vocabRuneString.split(/[,，]/g).filter((v) => {
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
    this.listOfPromptItems = [];

    this._views['prompt'] = new Prompt({
      page: this,
      disableGradingColor: true,
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

    this.listenTo(this._views['prompt'], 'next', this.handlePromptNext);
    this.listenTo(this._views['prompt'], 'previous', this.handlePromptPrevious);

    this.listenTo(this._views['toolbar'], 'nav:next', this.handlePromptNext);
    this.listenTo(this._views['toolbar'], 'nav:prev', this.handlePromptPrevious);
    this.listenTo(this._views['toolbar'], 'nav:vocab', this.handlePromptNavVocab);

    this.listenTo(vent, 'page:switch', (page, path) => {
      if (path.indexOf('practice/') > -1) {
        $('nav.navbar').addClass('practice');
      }
    });
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
        this._fetchCharacters(self.vocab.get('lang'), self.charactersToLoad)
          .then(this._onInitialVocabDataLoaded, this._onLoadError);
      }, this._onLoadError);
    }, this._onLoadError);
  },

  /**
   * Transforms a list of runes into Skritter vocab ids
   * @param vocabRunes
   */
  getVocabIdListFromRuneList (vocabRunes) {
    return vocabRunes.map((v) => {
      return app.fn.mapper.toBase(v, {lang: this.targetLang});
    }).join('|');
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
   * @method handlePromptNext
   * @param {PromptItemCollection} promptItems
   */
  handlePromptNext (promptItems) {
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

    if (promptItems) {
      this.currentPromptItems = promptItems;
    }
    this.previous();
  },

  /**
   * Navigates to an arbitrary vocab in the list of vocabs to practice
   * @param {Number} position the index of the vocab in the list to navigate to
   */
  handlePromptNavVocab (position) {
    if (position < 0 || position > this.listOfPromptItems.length - 1) {
      return;
    }

    this.position = position - 1;
    this.next();
  },

  /**
   * @method next
   */
  next () {
    if (this.position < this.listOfPromptItems.length - 1) {
      this.position++;
    } else {
      // TODO: make a real dialog
      app.notifyUser({
        message: 'You\'re finished!',
      });
    }
    const items = this.listOfPromptItems[this.position];

    if (this.previousPrompt) {
      this.togglePromptLoading(false);
      this._views['prompt'].reviewStatus.render();
      this._views['prompt'].set(this.currentPromptItems);
      this._views['toolbar'].updateVocabList(this.position);

      return;
    }

    if (items && items.length) {
      this.currentItem = items.at(0);
      this.currentPromptItems = items;
      this.togglePromptLoading(false);
      this._views['prompt'].reviewStatus.render();
      this._views['prompt'].set(this.currentPromptItems);
      this._views['toolbar'].updateVocabList(this.position);
      ScreenLoader.hide();

      if (app.config.recordLoadTimes) {
        this._recordLoadTime();
      }
    }
  },

  /**
   * @method previous
   */
  previous () {
    if (this.position > 0) {
      this.position--;
    }
    this.previousPromptItems = this.listOfPromptItems[this.position];

    this.togglePromptLoading(false);
    this._views['prompt'].reviewStatus.render();
    this._views['prompt'].set(this.previousPromptItems);
    this._views['toolbar'].updateVocabList(this.position);
  },

  /**
   * @method remove
   * @returns {PracticePadPage}
   */
  remove () {
    Howler.autoSuspend = true;
    $('nav.navbar').removeClass('practice');

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
   * @param {String[]} writings a list of character runes to load
   */
  _fetchCharacters (languageCode, writings) {
    const characters = [];
    writings.forEach((w) => {
      Array.from(w).forEach((character) => {
        characters.push(character);
      });
    });

    const uniqueWritings = _.uniq(characters).join('');

    return new Promise((resolve, reject) => {
      app.user.characters.fetch({
        data: {
          languageCode,
          writings: uniqueWritings,
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
    this.vocabs.forEach((v) => {
      if (this.charactersToLoad.indexOf(v.get('writing')) > -1) {
        this.listOfPromptItems.push(v.getPromptItems('rune'));
      }
    });
    this.position = 0;
    this.updatePrompt(this.position);
    ScreenLoader.hide();
  },

  /**
   * Updates the prompt with a specified item to study
   * @param {Number} position the current position in the list of vocabs to study
   */
  updatePrompt (position=this.position) {
    this.currentPromptItems = this.listOfPromptItems[position];
    this.currentItem = this.currentPromptItems.at(0);
    this._views['prompt'].set(this.listOfPromptItems[position]);
    this._views['toolbar'].updateVocabList(position);
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
