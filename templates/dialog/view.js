var GelatoDialog = require('base/gelato-dialog');

/**
 * @class Dialog
 * @extends {GelatoDialog}
 */
var Dialog = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'vclick #button-cancel': 'handleClickButtonCancel',
    'vclick #button-confirm': 'handleClickButtonConfirm'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {ConfirmDialog}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },
  /**
   * @method handleClickButtonCancel
   * @param {Event} event
   */
  handleClickButtonCancel: function(event) {
    event.preventDefault();
    this.close();
  },
  /**
   * @method handleClickButtonConfirm
   * @param {Event} event
   */
  handleClickButtonConfirm: function(event) {
    event.preventDefault();
    this.close()
  }
});

module.exports = Dialog;
