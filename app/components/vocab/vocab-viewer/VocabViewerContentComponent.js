const GelatoComponent = require('gelato/component');
const VocabViewerLookup = require('dialogs1/vocab-viewer/lookup/view');
const Items = require('collections/ItemCollection');
const Vocabs = require('collections/VocabCollection');
const VocabSentence = require('../vocab-sentence/VocabSentenceComponent');
const vent = require('vent');

/**
 * @class VocabViewerContentComponent
 * @extends {GelatoComponent}
 */
const VocabViewerContentComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .item-ban': 'handleClickItemBan',
    'click .item-unban': 'handleClickItemUnban',
    'click .fa-times-circle-o': 'handleClickClose',
    'click .fa-close': 'handleClickClose',
    'click #button-vocab-star': 'handleClickVocabStar',
    'click #button-vocab-ban': 'handleClickVocabBan',
    'click #hanping-lite-icon': 'handleClickHanpingLiteIcon',
    'click #hanping-pro-icon': 'handleClickHanpingProIcon',
    'click #hanping-yue-icon': 'handleClickHanpingYueIcon',
    'click #pleco-icon': 'handleClickPlecoIcon',
    'click #show-more-contained': 'handleClickShowMoreContained',
    'click #edit-vocab': 'handleClickEditVocab',
    'click #save-vocab': 'handleClickSaveVocab',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocabViewerContent'),

  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function (options) {
    options = options || {};
    this._views['sentence'] = new VocabSentence();
    this._views['lookup'] = new VocabViewerLookup();
    this.items = null;
    this.vocabs = null;
    this.vocabsContaining = null;
    this.editing = false;

    this.vocab = options.vocab;
    this.vocabWriting = null;

    this.items = new Items();
    this.vocabs = new Vocabs();
    this.vocabsContaining = new Vocabs();
  },

  /**
   * @method render
   * @returns {VocabViewerContentComponent}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileVocabViewerContent.jade');
    }

    this.renderTemplate();
    this._views['lookup'].setElement('#lookup-container').render();
    this._views['sentence'].setElement('#sentence-container').render();

    return this;
  },

  /**
   * @method getContainingCharacters
   * @returns {Array}
   */
  getContainingCharacters: function () {
    let baseWriting = this.vocabs.at(0).get('writing');
    return _.filter(
      this.vocabs.models,
      function (vocab) {
        return vocab.get('writing') !== baseWriting;
      }
    );
  },

  /**
   * @method getContainingWords
   * @returns {Array}
   */
  getContainingWords: function () {
    return _.filter(
      this.vocabsContaining.models,
      function (vocab) {
        return vocab.get('writing').length > 1;
      }
    );
  },

  /**
   *
   * @param event
   */
  handleClickClose: function (event) {
    if (app.isMobile()) {
      event.preventDefault();
      event.stopPropagation();

      vent.trigger('vocabInfo:toggle', false);
    }
  },

  /**
   * Handles when the user clicks on an edit icon. Sets the editing state to
   * true and rerenders the component.
   * @param event
   */
  handleClickEditVocab: function (event) {
    event.preventDefault();

    this.editing = true;
    this.render();
  },

  /**
   * @method handleClickHanpingLiteIcon
   * @param event
   */
  handleClickHanpingLiteIcon: function (event) {
    event.preventDefault();

    if (app.isCordova()) {
      plugins.core.openHanpingLite(this.vocabWriting);
    } else {
      console.info('HANPING LITE:', this.vocabWriting);
    }
  },

  /**
   * @method handleClickHanpingProIcon
   * @param event
   */
  handleClickHanpingProIcon: function (event) {
    event.preventDefault();

    if (app.isCordova()) {
      plugins.core.openHanpingPro(this.vocabWriting);
    } else {
      console.info('HANPING PRO:', this.vocabWriting);
    }
  },

  /**
   * @method handleClickHanpingYueIcon
   * @param event
   */
  handleClickHanpingYueIcon: function (event) {
    event.preventDefault();

    if (app.isCordova()) {
      plugins.core.openHanpingYue(this.vocabWriting);
    } else {
      console.info('HANPING YUE:', this.vocabWriting);
    }
  },

   /**
   * @method handleClickItemBan
   * @param {Event} event
   */
  handleClickItemBan: function (event) {
    event.preventDefault();
    let vocab = this.vocabs.at(0);
    let $row = this.$(event.target).closest('tr');
    vocab.banPart($row.data('part')).save();
    this.render();
  },

  /**
   * @method handleClickItemUnban
   * @param {Event} event
   */
  handleClickItemUnban: function (event) {
    event.preventDefault();
    let vocab = this.vocabs.at(0);
    let $row = this.$(event.target).closest('tr');
    vocab.unbanPart($row.data('part')).save();
    this.render();
  },

  /**
   * @method handleClickPlecoIcon
   * @param event
   */
  handleClickPlecoIcon: function (event) {
    event.preventDefault();

    if (app.isCordova()) {
      plugins.core.openPleco(this.vocabWriting);
    } else {
      console.info('PLECO:', this.vocabWriting);
    }
  },

  /**
   * Handles when the user clicks the save button. Saves the vocab,
   * resets the editing state and then rerenders the component.
   * @param event
   */
  handleClickSaveVocab: function (event) {
    event.preventDefault();

    const definitionText = this.$('#vocab-definition .definition').val() || '';
    const mnemonicText = this.$('#vocab-mnemonic .mnemonic').val() || '';

    this.vocab.set({
      customDefinition: definitionText,
      mnemonic: {public: false, text: mnemonicText},
    });

    this.vocab.save();

    this.editing = false;

    this.render();
  },

  /**
   * @method set
   * @param {Vocabs} vocabs
   * @param {Vocabs} vocabsContaining
   * @param {Array} items
   * @returns {VocabViewerContentComponent}
   */
  set: function (vocabs, vocabsContaining, items) {
    this.items = items || null;
    this.vocab = vocabs.at(0) || null;
    this.vocabWriting = vocabs.at(0).get('writing');
    this.vocabs = vocabs || null;
    this.vocabsContaining = vocabsContaining || null;

    this._views['lookup'].set(vocabs);
    this._views['sentence'].fetchAndShowSentence(null, this.vocab);

    return this.render();
  },

  remove: function () {
    this.vocabs.reset();

    return GelatoComponent.prototype.remove.call(this);
  },

  /**
   * Handles a touch to an icon. Toggles the star state of the vocab and
   * rerenders the dialog.
   * @method handleClickVocabStar
   * @param {jQuery.Event} event the touch event to the icon
   */
  handleClickVocabStar: function (event) {
    const vocab = this.vocabs.at(0);

    vocab.toggleStarred();
    vocab.save();

    this.render();
  },

  /**
   * @method handleClickShowMoreContained
   * @param event
   */
  handleClickShowMoreContained: function (event) {
    this.$('#show-more-contained').hide();
    this.$('#vocab-words-containing').addClass('show-all');
  },

  /**
   * Handles a touch to an icon. Toggles the star state of the vocab and
   * rerenders the dialog.
   * @method handleClickVocabStar
   * @param {jQuery.Event} event the touch event to the icon
   */
  handleClickVocabBan: function (event) {
    const vocab = this.vocabs.at(0);

    event.preventDefault();

    vocab.banAll();
    vocab.save();

    this.render();
  },

  /**
   * Loads a specified vocab. Fetches required missing information, if needed,
   * or loads it from a VocabModel sent in.
   * @param {String} vocabId the id of the vocab to fetch data for
   * @param {VocabModel} [vocabInfo] the vocab model that would otherwise be fetched by id
   */
  loadVocab: function (vocabId, vocabInfo) {
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
    }

    if (vocabInfo && vocabInfo.vocabs.length) {
      this.set(vocabInfo.vocabs, vocabInfo.vocabsContaining, vocabInfo.items);
      return;
    }

    const self = this;
    let wordItems = null;
    let wordVocabs = null;
    let wordVocabsContaining = null;

    if (vocabId) {
      this.vocabWriting = app.fn.mapper.fromBase(vocabId);
    }

    this.vocabs.reset();
    this.render();

    async.parallel(
      [
        function (callback) {
          async.series(
            [
              function (callback) {
                self.vocabs.fetch({
                  data: {
                    include_decomps: true,
                    include_heisigs: true,
                    include_sentences: false,
                    include_top_mnemonics: true,
                    ids: vocabId,
                  },
                  error: function (error) {
                    callback(error);
                  },
                  success: function (vocabs) {
                    wordVocabs = vocabs;
                    callback();
                  },
                });
              },
              function (callback) {
                if (!self.vocabs.at(0).sentenceFetched) {
                  self.vocabs.at(0).fetchSentence().then((sentence) => {
                    self.vocabs.sentences.add(sentence);
                    callback();
                  });
                } else {
                  callback();
                }
              },
              function (callback) {
                if (self.vocabs.at(0).has('containedVocabIds')) {
                  self.vocabs.fetch({
                    data: {
                      ids: self.vocabs.at(0).get('containedVocabIds').join('|'),
                    },
                    remove: false,
                    error: function (error) {
                      callback(error);
                    },
                    success: function (vocabs) {
                      wordVocabs = vocabs;
                      callback(null);
                    },
                  });
                } else {
                  callback();
                }
              },
              function (callback) {
                if (app.router.page.title.indexOf('Demo') === -1) {
                  self.items.fetch({
                    data: {
                      vocab_ids: vocabId,
                    },
                    error: function (error) {
                      callback(error);
                    },
                    success: function (items) {
                      wordItems = items;
                      callback(null);
                    },
                  });
                } else {
                  // skip fetch for the demo--user isn't logged in and
                  // doesn't have items to fetch
                  callback();
                }
              },
            ],
            callback
          );
        },
        function (callback) {
          self.vocabsContaining.fetch({
            data: {
              include_containing: true,
              q: app.fn.mapper.fromBase(vocabId),
            },
            error: function (error) {
              callback(error);
            },
            success: function (vocabs) {
              wordVocabsContaining = vocabs;
              callback();
            },
          });
        },
      ],
      function (error) {
        if (error) {
          console.error('WORD DIALOG LOAD ERROR:', error);
        } else {
          self.vocab = wordVocabs.at(0);

          if (self.vocab) {
            wordVocabsContaining.remove(self.vocab.id);
          }

          self.set(wordVocabs, wordVocabsContaining, wordItems);

          if (app.config.recordLoadTimes) {
            const loadTime = window.performance.now() - self.loadStart;
            app.loadTimes.pages.vocabInfoViewer.push(loadTime);
          }
        }
      }
    );
  },
});

module.exports = VocabViewerContentComponent;
