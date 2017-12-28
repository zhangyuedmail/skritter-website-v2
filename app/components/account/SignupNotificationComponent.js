const GelatoComponent = require('gelato/component');

/**
 * A component that notifies the user if their account subscription has expired
 * and has a call to action to reactivate their description.
 * @class SignupNotificationComponent
 * @extends {GelatoComponent}
 */
const SignupNotificationComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #signup-btn': 'handleSignupBtnClicked'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./SignupNotification'),

  /**
   * @method initialize
   * @param {Object} [options]
   */
  initialize: function (options) {
    options = options || {};
  },

  /**
   * @method render
   * @returns {SignupNotificationComponent}
   */
  render: function () {
    this.renderTemplate();

    return this;
  },

  handleSignupBtnClicked: function () {
    app.signup();
  },

});

module.exports = SignupNotificationComponent;
