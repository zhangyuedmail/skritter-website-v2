var GelatoComponent = require('gelato/component');
/**
 * @class VocablistHistoryTable
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
   * @constructor
   */
  initialize: function(options) {
    this.history = options.history;

    this.listenTo(this.history, 'state', this.render);
  },

  getHistory: function() {
    this.history.fetch();
  },

  /**
   * @method render
   * @returns {VocablistTable}
   */
  render: function() {
    this.renderTemplate();
    this.delegateEvents();

    return this;
  }
});
