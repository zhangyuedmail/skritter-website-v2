let GelatoComponent = require('gelato/component');
let VocablistHistoryTableComponent = require('components/vocablists/VocablistsHistoryTableComponent');
/**
 * @class AddVocabContent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
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
    this.dialog = options.dialog;

    this._views['historyTable'] = new VocablistHistoryTableComponent({
      history: options.vocablist.history,
    });
  },

  /**
   * @method render
   * @returns {AddVocabContent}
   */
  render: function() {
    this.renderTemplate();
    this._views['historyTable'].setElement(this.$('#history-table-container'));
    this.getHistory();

    return this;
  },

  getHistory: function() {
    this._views['historyTable'].getHistory();
  },
});
