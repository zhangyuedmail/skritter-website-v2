var GelatoComponent = require('gelato/component');

/**
 * A component that notifies the user if their account subscription has expired
 * and has a call to action to reactivate their description.
 * @class ExpiredNotification
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  events: {
    'click #hide-sub-expired': 'handleHideSubscriptionExpiredNotice'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {Dashboard}
   */
  render: function() {
    this.renderTemplate();

    app.user.isSubscriptionActive(_.bind(this.updateSubscriptionState, this));

    return this;
  },

  /**
   *
   * @param {jQuery.Event} event
   * @method handleHideSubscriptionExpiredNotice
   */
  handleHideSubscriptionExpiredNotice: function(event) {
    event.preventDefault();

    app.setSetting('hideSubscriptionNotification', true);
    this.updateSubscriptionState();
  },

  /**
   * Determines whether to show or hide the notification based on the
   * subscription status
   * @method updateSubscriptionState
   */
  updateSubscriptionState: function() {
    var sub = app.user.subscription;
    var hide = app.getSetting('hideSubscriptionNotification');

    if (sub.state === 'standby') {
      this.$('gelato-component').toggleClass('hidden', sub.getStatus() !== 'Expired' || hide);
    }
  }
});
