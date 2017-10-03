let BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class ProgressDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    this.title = _.result(options, 'title');
    this.showBar = _.result(options, 'showBar', true);
  },
  /**
   * @method render
   * @returns {ProgressDialog}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },
  /**
   * Takes from 0 to 100
   * @method setProgress
   * @param {Number} percent
   */
  setProgress: function(percent) {
    this.$('.progress-bar').css('width', percent + '%');
  },
});
