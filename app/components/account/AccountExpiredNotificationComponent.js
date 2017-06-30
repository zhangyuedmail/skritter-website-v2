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
   * @method initialize
   * @param {Object} [options]
   */
  initialize: function(options) {
    options = options || {};

    this.hideable = _.defaultTo(options.hideable, true);
  },

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
    const sub = app.user.subscription;
    const hide = app.getSetting('hideSubscriptionNotification');
    let hideNotification;

    if (this.hideable) {
      hideNotification = sub.getStatus() !== 'Expired' || hide
    } else {
      hideNotification = sub.getStatus() !== 'Expired';
    }

    if (sub.state === 'standby') {
      this.$('gelato-component').toggleClass('hidden', hideNotification);

      // something somewhere is manually setting the CSS to
      // display: hidden at runtime, don't know where, hack to fix it.
      if (!hideNotification) {
        this.$('gelato-component').css({display: 'block'});
      }
    }
  }

});

module.exports = ExpiredNotificationComponent;
