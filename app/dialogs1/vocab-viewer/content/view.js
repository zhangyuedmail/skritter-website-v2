const GelatoComponent = require('gelato/component');
const VocabViewerLookup = require('dialogs1/vocab-viewer/lookup/view');
var Items = require('collections/ItemCollection');
var Vocabs = require('collections/VocabCollection');
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
    'click .fa-times-circle-o': 'handleClickClose'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(options) {
    options = options || {};
    this.lookup = new VocabViewerLookup();
    this.items = null;
    this.vocabs = null;
    this.vocabsContaining = null;

    this.vocab = options.vocab;

    this.items = new Items();
    this.vocabs = new Vocabs();
    this.vocabsContaining = new Vocabs();
  },

  /**
   * @method render
   * @returns {VocabViewerContentComponent}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./mobile.jade');
    }

    this.renderTemplate();
    this.lookup.setElement('#lookup-container').render();

    return this;
  },

  /**
   * @method getContainingCharacters
   * @returns {Array}
   */
  getContainingCharacters: function() {
    var baseWriting = this.vocabs.at(0).get('writing');
    return _.filter(
      this.vocabs.models,
      function(vocab) {
        return vocab.get('writing') !== baseWriting;
      }
    );
  },

  /**
   * @method getContainingWords
   * @returns {Array}
   */
  getContainingWords: function() {
    return _.filter(
      this.vocabsContaining.models,
      function(vocab) {
        return vocab.get('writing').length > 1;
      }
    );
  },

  /**
   *
   * @param event
   */
  handleClickClose: function(event) {
    if (app.isMobile()) {
      event.preventDefault();
      event.stopPropagation();

      vent.trigger('vocabInfo:toggle', false);
    }
  },

  /**
   * @method handleClickItemBan
   * @param {Event} event
   */
  handleClickItemBan: function(event) {
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
  handleClickItemUnban: function(event) {
    event.preventDefault();
    let vocab = this.vocabs.at(0);
    let $row = this.$(event.target).closest('tr');
    vocab.unbanPart($row.data('part')).save();
    this.render();
  },

  /**
   * @method set
   * @param {Vocabs} vocabs
   * @param {Vocabs} vocabsContaining
   * @param {Array} items
   * @returns {VocabViewerContentComponent}
   */
  set: function(vocabs, vocabsContaining, items) {
    this.items = items || null;
    this.vocabs = vocabs || null;
    this.vocabsContaining = vocabsContaining || null;
    this.lookup.set(vocabs);

    return this.render();
  },

  remove: function() {
    this.vocabs.reset();

    return GelatoComponent.prototype.remove.call(this);
  },

  loadVocab: function(vocabId, vocab) {
    const self = this;
    let wordItems = null;
    let wordVocabs = null;
    let wordVocabsContaining = null;

    if (vocab) {
      this.vocab = vocab;
    }

    async.parallel(
      [
        function(callback) {
          async.series(
            [
              function(callback) {
                self.vocabs.fetch({
                  data: {
                    include_decomps: true,
                    include_heisigs: true,
                    include_sentences: true,
                    include_top_mnemonics: true,
                    ids: vocabId
                  },
                  error: function(error) {
                    callback(error);
                  },
                  success: function(vocabs) {
                    wordVocabs = vocabs;
                    callback();
                  }
                });
              },
              function(callback) {
                if (self.vocabs.at(0).has('containedVocabIds')) {
                  self.vocabs.fetch({
                    data: {
                      ids: self.vocabs.at(0).get('containedVocabIds').join('|')
                    },
                    remove: false,
                    error: function(error) {
                      callback(error);
                    },
                    success: function(vocabs) {
                      wordVocabs = vocabs;
                      callback(null);
                    }
                  });
                } else {
                  callback();
                }
              },
              function(callback) {
                self.items.fetch({
                  data: {
                    vocab_ids: vocabId
                  },
                  error: function(error) {
                    callback(error);
                  },
                  success: function(items) {
                    wordItems = items;
                    callback(null);
                  }
                });
              }
            ],
            callback
          )
        },
        function(callback) {
          self.vocabsContaining.fetch({
            data: {
              include_containing: true,
              q: vocabId
            },
            error: function(error) {
              callback(error);
            },
            success: function(vocabs) {
              wordVocabsContaining = vocabs;
              callback();
            }
          });
        }
      ],
      function(error) {
        if (error) {
          console.error('WORD DIALOG LOAD ERROR:', error);
        } else {
          wordVocabsContaining.remove(wordVocabs.at(0).id);
          self.set(wordVocabs, wordVocabsContaining, wordItems);
        }
      }
    );
  }
});

module.exports = VocabViewerContentComponent;
