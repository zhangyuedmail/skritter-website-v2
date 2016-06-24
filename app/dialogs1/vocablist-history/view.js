var GelatoComponent = require('gelato/component');

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
    this.vocablist = options.vocablist;
  },

  /**
   * @method render
   * @returns {AddVocabContent}
   */
  render: function() {
    this.renderTemplate();

    this.fetchListHistory();

    return this;
  },

  fetchListHistory: function() {
    var self = this;
    this.vocablist.getChangeHistory(function() {
      console.log(self.vocablist.changeHistory);
    });
  }

});
