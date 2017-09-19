var GelatoDialog = require('base/gelato-dialog');

/**
 * @class SetGoal
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
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
    'click #button-cancel': 'handleClickButtonCancel',
    'click #button-set': 'handleClickSetChange'
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
   * @method handleClickButtonChange
   * @param {Event} event
   */
  handleClickSetChange: function(event) {
    event.preventDefault();

  }
});
