let GelatoDialog = require('gelato/dialog');
let Content = require('./content/view');

/**
 * @class AddVocabConfirm
 * @extends {GelatoDialog}
 */
let AddVocabConfirm = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function (options) {
    options = options || {};
    this.content = new Content({dialog: this});
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {AddVocabConfirm}
   */
  render: function () {
    this.renderTemplate();
    this.content.setElement('#content-container').render();

    return this;
  },
});

module.exports = AddVocabConfirm;
