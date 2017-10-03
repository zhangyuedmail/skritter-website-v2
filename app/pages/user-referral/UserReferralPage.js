let GelatoPage = require('gelato/page');

/**
 * A page that explains the foundation of Skritter, our learning philosophy,
 * and shows the Skritter team members.
 * @class About
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * Dictionary of events the view should listen to and the
   * corresponding handlers.
   * @property events
   * @type {Object<String, String>}
   */
  events: {
    'click #user-link': 'handleUserLinkClicked',
  },

  /**
   * HTML Title text
   * @type {String}
   */
  title: 'User Referrals - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./UserReferral'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    if (app.user.getAccountAgeBy('days') < 4) {
      app.router.navigate('dashboard');
    }

    app.mixpanel.track('Viewed refer page');
  },

  /**
   * @method render
   * @returns {About}
   */
  render: function () {
    this.renderTemplate();
    let self = this;

    _.defer(function () {
      self.$('#user-link').select().focus();
    });

    return this;
  },

  /**
   * @method remove
   * @returns {About}
   */
  remove: function () {
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Selects the user's referral link when they click on it.
   * @method handleUserLinkClicked
   */
  handleUserLinkClicked: function () {
    this.$('#user-link').select();
  },
});
