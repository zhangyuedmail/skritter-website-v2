let GelatoComponent = require('gelato/component');

/**
 * @class ExportVocablistContent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function (options) {
    this.dialog = options.dialog;
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {},
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {ExportVocablistContent}
   */
  render: function () {
    this.renderTemplate();
    this.listenToOnce(this.dialog.vocablist, 'state', this.render);
    return this;
  },
});
