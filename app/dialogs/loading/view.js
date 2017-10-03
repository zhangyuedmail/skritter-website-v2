let BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class LoadingDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @property template
   * @type {Function}
   */
  template: require('dialogs/loading/template'),
  /**
   * @method render
   * @returns {LoadingDialog}
   */
  render: function () {
    this.renderTemplate();
    return this;
  },
});
