const GelatoDialog = require('gelato/dialog');

/**
 * @class VocabViewer
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.set(options);
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./NotificationDialog.jade'),

  /**
   * @method render
   * @returns {VocabViewer}
   */
  render: function() {
    this.renderTemplate({
      dialogTitle: this.dialogTitle,
      showTitle: this.showTitle,
      body: this.body,
      buttonText: this.buttonText,
      showConfirmButton: this.showConfirmButton
    });

    return this;
  },

  /**
   * Sets the content of the dialog
   * @param {Object} options content and display options for the dialog
   * @param {String} [options.dialogTitle] the title for the dialog
   * @param {Boolean} [options.showTitle] whether to show a title on the dialog
   * @param {String} [options.body] the text to display
   * @param {String} [options.buttonText] the text for the confirm/close button
   * @param {Boolean} [options.showConfirmButton] whether to show a button to confirm/close the dialog
   */
  set: function(options) {
    options = options || {};

    this.dialogTitle = options.dialogTitle;
    this.showTitle = options.showTitle;
    this.body = options.body;
    this.buttonText = options.buttonText;
    this.showConfirmButton = options.showConfirmButton;

    return this;
  }
});
