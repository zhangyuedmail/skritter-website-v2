const GelatoDialog = require('gelato/dialog');

/**
 * Generic dialog that shows a subview inside of it
 * @class ViewDialog
 * @extends {GelatoDialog}
 */
const ViewDialog = GelatoDialog.extend({

  events: {
    'click #button-cancel': 'handleClickButtonCancel',
  },

  /**
   * @method initialize
   * @param {Object} options contains params needed to construct the subview to display
   * @param {Function} options.content the constructor function for the view to display
   * @param {object} [options.contentOptions] any additional options to send to the subview
   */
  initialize: function(options) {
    if (!options || !options.content || typeof options.content !== 'function') {
      throw 'View constructor function must be sent as option to dialog';
    }

    this.showCloseButton = options.showCloseButton || false;
    this.showTitle = options.showTitle || false;
    this.dialogTitle = options.dialogTitle || '';

    const contentOptions = _.extend(options.contentOptions || {}, {dialog: this});

    this.content = new options.content(contentOptions);
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {ViewDialog}
   */
  render: function() {
    this.renderTemplate();
    this.content.setElement('#content-container').render();

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
});

module.exports = ViewDialog;
