let BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class ConfirmLogoutDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @property template
   * @type {Function}
   */
  template: require('dialogs/confirm-logout/template'),
  /**
   * @method render
   * @returns {ConfirmLogoutDialog}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-cancel': 'handleClickButtonCancel',
    'click #button-logout': 'handleClickButtonLogout',
  },
  /**
   * @method handleClickButtonLogout
   * @param {Event} event
   */
  handleClickButtonLogout: function(event) {
    event.preventDefault();
    this.trigger('logout');
  },
  /**
   * @method handleClickButtonCancel
   * @param {Event} event
   */
  handleClickButtonCancel: function(event) {
    event.preventDefault();
    this.close();
  },
});
