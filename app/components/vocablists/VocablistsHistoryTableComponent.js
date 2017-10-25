const GelatoComponent = require('gelato/component');

/**
 * @class VocablistsHistoryTableComponent
 * @extends {GelatoComponent}
 */
const VocablistsHistoryTableComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsHistoryTable'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    this.history = options.history;

    this.listenTo(this.history, 'state', this.render);
  },

  getHistory: function () {
    this.history.fetch();
  },

  /**
   * @method render
   * @returns {VocablistsHistoryTableComponent}
   */
  render: function () {
    this.renderTemplate();
    this.delegateEvents();

    return this;
  },

});

module.exports = VocablistsHistoryTableComponent;
