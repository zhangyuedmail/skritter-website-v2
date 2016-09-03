var GelatoComponent = require('gelato/component');

var VocabViewerLookup = require('dialogs1/vocab-viewer/lookup/view');

/**
 * @class VocabViewerContent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .item-ban': 'handleClickItemBan',
    'click .item-unban': 'handleClickItemUnban'
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
  },

  /**
   * @method render
   * @returns {VocabViewerContent}
   */
  render: function() {
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
   * @method handleClickItemBan
   * @param {Event} event
   */
  handleClickItemBan: function(event) {
    event.preventDefault();
    var vocab = this.vocabs.at(0);
    var $row = this.$(event.target).closest('tr');
    vocab.banPart($row.data('part')).save();
    this.render();
  },

  /**
   * @method handleClickItemUnban
   * @param {Event} event
   */
  handleClickItemUnban: function(event) {
    event.preventDefault();
    var vocab = this.vocabs.at(0);
    var $row = this.$(event.target).closest('tr');
    vocab.unbanPart($row.data('part')).save();
    this.render();
  },

  /**
   * @method set
   * @param {Vocabs} vocabs
   * @param {Vocabs} vocabsContaining
   * @param {Array} items
   * @returns {VocabViewerContent}
   */
  set: function(vocabs, vocabsContaining, items) {
    this.items = items || null;
    this.vocabs = vocabs || null;
    this.vocabsContaining = vocabsContaining || null;
    this.lookup.set(vocabs);
    return this.render();
  }
});
