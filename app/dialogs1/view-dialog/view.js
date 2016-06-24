var GelatoDialog = require('gelato/dialog');

/**
 * Generic dialog that shows a subview inside of it
 * @class ViewDialog
 * @extends {GelatoDialog}
 */
var ViewDialog = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options contains params needed to construct the subview to display
   * @param {Function} options.content the constructor function for the view to display
   * @param {object} [options.contentOptions] any additional options to send to the subview
   */
  initialize: function(options) {
    if (!options || !options.content || typeof options.content !== 'function') {
      throw "View constructor function must be sent as option to dialog";
    }
    
    var contentOptions = _.extend(options.contentOptions || {}, {dialog: this});

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
  }
});

module.exports = ViewDialog;
