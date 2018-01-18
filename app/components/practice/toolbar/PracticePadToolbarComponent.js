const GelatoComponent = require('gelato/component');

/**
 * @class PracticePadToolbarComponent
 * @extends {GelatoComponent}
 */
const PracticePadToolbarComponent = GelatoComponent.extend({

  events: {},

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
        selected: i === position,
        visible: (i < minVisible || i > maxVisible),
      });
    }

    this.$('#vocab-list-wrapper').html(vocabListStr);

    this.updateVocabList();
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
      $(vocabItems[i]).toggleClass('hidden', (i < minVisible || i > maxVisible));
    }

    $(vocabItems[position]).addClass('selected');

    if (vocabs.length < 2) {
      this.$('.nav-list-btn').addClass('hidden');
    }

    if (position === 0) {
      this.$('#prev-vocab-btn').addClass('hidden');
    }

    if (position === vocabs.length - 1) {
      this.$('#next-vocab-btn').addClass('hidden');
    }
  },
});

module.exports = PracticePadToolbarComponent;
