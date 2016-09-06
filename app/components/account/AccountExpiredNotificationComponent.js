const GelatoComponent = require('gelato/component');

/**
 * A component that notifies the user if their account subscription has expired
 * and has a call to action to reactivate their description.
 * @class ExpiredNotificationComponent
 * @extends {GelatoComponent}
 */
const ExpiredNotificationComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #hide-sub-expired': 'handleHideSubscriptionExpiredNotice'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./AccountExpiredNotification'),

  /**
   * @method render
   * @returns {ExpiredNotificationComponent}
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

module.exports = ExpiredNotificationComponent;
