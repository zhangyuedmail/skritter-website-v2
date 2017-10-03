let GelatoDialog = require('base/gelato-dialog');

/**
 * @class DemoCallToActionDialog
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
    'click #button-back': 'handleClickButtonBack',
    'click #button-signup': 'handleClickButtonSignup',
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./DemoComplete.jade'),
  /**
   * @method render
   * @returns {DemoCallToActionDialog}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },
  /**
   * @method handleClickButtonBack
   * @param {Event} event
   */
  handleClickButtonBack: function(event) {
    event.preventDefault();
    this.close();
    this.once('hidden', function() {
      app.router.navigate('', {trigger: true});
    });
  },
  /**
   * @method handleClickButtonSignup
   * @param {Event} event
   */
  handleClickButtonSignup: function(event) {
    event.preventDefault();
    this.close();
    this.once('hidden', function() {
      app.router.navigate('signup', {trigger: true});
    });
  },
});
