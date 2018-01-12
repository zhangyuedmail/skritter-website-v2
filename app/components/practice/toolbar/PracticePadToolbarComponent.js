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

    return this;
  },

  /**
   * Updates the vocab list visually with the 5 most relevant vocabs
   * @param {Number} position the currently selected vocab
   */
  updateVocabList (position = 0) {
    // TODO: limit this to the 5 most relevant items...need to do some math with the offset
    const items = this.page.promptItems.models;
    let processed = 0;
    let vocabListStr = '';
    for (let i = 0; i < items.length; i++) {
      if (processed >= 5) {
        break;
      }

      let s = '<span class="vocab-item';
      // TODO: some class work...should probably refactor this out into a template
      if (i === position) {
        s += ' selected';
      }

      s += '">';
      s += items[i].vocab.get('writing');
      s += '</span>';

      vocabListStr += s;
      processed++;
    }

    this.$('#vocab-list-wrapper').html(vocabListStr);

    if (this.page.promptItems.models.length < 2) {
      this.$('.nav-list-btn').addClass('hidden');
    }
  },
});

module.exports = PracticePadToolbarComponent;
