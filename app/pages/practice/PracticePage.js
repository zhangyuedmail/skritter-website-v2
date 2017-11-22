const GelatoPage = require('gelato/page');
const Prompt = require('components/prompt/StudyPromptComponent.js');
const Toolbar = require('components/practice/toolbar/PracticePadToolbarComponent.js');
const ItemCollection = require('collections/ItemCollection');
const VocabCollection = require('collections/VocabCollection');
const QuickSettings = require('dialogs1/quick-settings/QuickSettingsDialog.js');

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

    this.targetLang = options.targetLang;

    // TODO: send this in from URL
    const fakeUrlParamString = '好';
    this.charactersToLoad = fakeUrlParamString.split(',');
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

    this._views['prompt'] = new Prompt({page: this});
    this._views['toolbar'] = new Toolbar({page: this});

    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
    this.listenTo(vent, 'studySettings:show', this.showStudySettings);

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

    this.checkRequirements();

    return this;
  },

  /**
   * @method checkRequirements
   */
  checkRequirements () {
    ScreenLoader.post('Preparing practice');
    const self = this;

    async.waterfall(
      [(callback) => {
        this.vocabs.fetch({
          data: {
            include_decomps: true,
            include_heisigs: true,
            include_sentences: false,
            include_top_mnemonics: true,
            ids: this.idsToLoad,
          },
          error: function (error) {
            callback(error);
          },
          success: function (vocabs) {
            self.vocab = vocabs.at(0);
            callback();
          },
        });
      },
      function(callback) {
        if (self.vocab.has('containedVocabIds')) {
          self.vocabs.fetch({
            data: {
              include_decomps: true,
              include_sentences: true,
              ids: self.vocab.get('containedVocabIds').join('|'),
            },
            remove: false,
            error: function(error) {
              callback(error);
            },
            success: function() {
              callback();
            },
          });
        } else {
          callback();
        }
      },
      function (callback) {
        app.user.characters.fetch({
          data: {
            languageCode: self.vocab.get('lang'),
            writings: self.vocab.get('writing'),
          },
          remove: false,
          error: function (error) {
            callback(error);
          },
          success: function () {
            callback();
          },
        });
      },
      ],
      (error) => {
        if (error) {
          let msg = 'Error fetching items. Please ';
          if (app.isMobile()) {
            msg += 'reload the application';
          } else {
            msg += 'refresh the page.';
          }
          ScreenLoader.post(msg);
          return;
        }

        const runeItems = self.vocab.getPromptItems('rune');
        self.promptItems = runeItems;
        this._views['prompt'].set(this.promptItems);
        ScreenLoader.hide();
      }
    );
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
   * Shows a dialog that allows the user to adjust their study settings
   * @method showStudySettings
   */
  showStudySettings () {
    const dialog = new QuickSettings();

    dialog.open();

    dialog.on('save', (settings) => {
      ScreenLoader.show();
      ScreenLoader.post('Saving study settings');
      app.user.set(settings, {merge: true});
      app.user.cache();
      app.user.save(
        null,
        {
          error: () => {
            ScreenLoader.hide();
            dialog.close();
          },
          success: () => {
            // TODO: figure out why this causes canvas sizing issue
            // this.render();
            // dialog.close();

            app.reload();
          },
        }
      );
    });
  },

  /**
   * Toggles the loading state on the canvas when fetching new items
   * @param {Boolean} loading whether the prompt is loading
   */
  togglePromptLoading (loading) {
    this._views['prompt'].toggleLoadingIndicator(loading);
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
