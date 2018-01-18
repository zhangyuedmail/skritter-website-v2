const GelatoComponent = require('gelato/component');

/**
 * @class PracticePadToolbarComponent
 * @extends {GelatoComponent}
 */
const PracticePadToolbarComponent = GelatoComponent.extend({

  events: {
    'click .nav-list-btn': 'handleNavListBtnClicked',
    'click .vocab-item': 'handleVocabItemClicked',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./PracticePadToolbarComponent.jade'),

  /**
   * Template for individual vocab list items
   * @type {Function}
   */
  vocabItemTemplate: require('./PracticePadToolbarVocabItem.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    this.dueCountOffset = 0;
    this.page = options.page;
  },

  /**
   * @method render
   * @returns {PracticePadToolbarComponent}
   */
  render: function () {
    this.renderTemplate();
    this.renderVocabs();

    return this;
  },

  /**
   * Renders the list with all the vocabs in the list
   * @param {Number} position the currently selected vocab
   */
  renderVocabs (position = 0) {
    const vocabs = this.page.charactersToLoad;
    const ids = this.page.idsToLoad.split('|');
    const minVisible = Math.max(0, position - 2);
    const maxVisible = Math.min(vocabs.length, position + 2);

    let vocabListStr = '';

    for (let i = 0; i < vocabs.length; i++) {
      vocabListStr += this.vocabItemTemplate({
        vocab: vocabs[i],
        id: ids[i],
        position: i,
        selected: i === position,
        visible: (i < minVisible || i > maxVisible),
      });
    }

    this.$('#vocab-list-wrapper').html(vocabListStr);

    this.updateVocabList();
  },

  /**
   * Handles a user clicking on a navigation arrow in the list and fires
   * an event to navigate to the specified vocab.
   * @param {jQuery.ClickEvent} event the click event
   */
  handleNavListBtnClicked (event) {
    const direction = $(event.currentTarget).data('direction');
    this.trigger('nav:' + direction);
  },

  /**
   * Handles a user clicking on a vocab item in the list and fires an event
   * to navigate to the specified vocab.
   * @param {jQuery.ClickEvent} event the click event
   */
  handleVocabItemClicked (event) {
    const pos = $(event.currentTarget).data('position');
    this.trigger('nav:vocab', pos);
  },

  /**
   * Updates the vocab list visually with the 5 most relevant vocabs
   * @param {Number} position the currently selected vocab
   */
  updateVocabList (position = 0) {
    const vocabs = this.page.charactersToLoad;
    const minVisible = Math.max(0, position - 2);
    const maxVisible = Math.min(vocabs.length, position + 2);
    const vocabItems = this.$('.vocab-item');

    for (let i = 0; i < vocabItems.length; i++) {
      $(vocabItems[i])
        .toggleClass('hidden', (i < minVisible || i > maxVisible))
        .toggleClass('selected', i === position);
    }

    this.$('.nav-list-btn').toggleClass('hidden', vocabs.length < 2);
    this.$('#prev-vocab-btn').toggleClass('invisible', position === 0);
    this.$('#next-vocab-btn').toggleClass('invisible', position === vocabs.length - 1);
  },
});

module.exports = PracticePadToolbarComponent;
