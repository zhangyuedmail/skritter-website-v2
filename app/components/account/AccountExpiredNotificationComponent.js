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
    'click #hide-sub-expired': 'handleHideSubscriptionExpiredNotice',
    'click #reload-page-btn': 'handleClickReloadPage'
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
    _.bindAll(this, 'updateSubscriptionState', 'errorFetchingSubscription');

    this.errorFetchingData = false;

    options = options || {};

    this.hideable = _.defaultTo(options.hideable, true);
  },

  /**
   * @method render
   * @returns {ExpiredNotificationComponent}
   */
  render: function() {
    this.renderTemplate();

    app.user.isSubscriptionActive(this.updateSubscriptionState, this.errorFetchingSubscription);

    return this;
  },

  /**
   * Handles case where there's an error fetching a user's subscription.
   * Notifies the user of network issues.
   * @param error
   */
  errorFetchingSubscription: function(error) {
    this.errorFetchingData = true;
    this.updateSubscriptionState();
    this.trigger('data-fetch:failed', 'accountExpired');
  },

  /**
   * Reloads the page so that all the network requests can be retried
   * @param {jQuery.Event} event
   */
  handleClickReloadPage: function(event) {
    app.reload();
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
    let hideNotification, networkError;

    if (this.hideable) {
      hideNotification = sub.getStatus() !== 'Expired' || hide
    } else {
      hideNotification = sub.getStatus() !== 'Expired';
    }

    if (sub.state === 'standby') {
      if (this.errorFetchingData && app.user.offline.isReady()) {
        // disable network error stuff when offline is working
        networkError = false;
      } else if (this.errorFetchingData) {
        this.$('.network-error-block').removeClass('hidden');
        this.$('.account-expired-block').addClass('hidden');

        // use a variable to represent a network issue
        networkError = true;
      }

      this.$('gelato-component').toggleClass('hidden', hideNotification && !networkError);

      // something somewhere is manually setting the CSS to
      // display: hidden at runtime, don't know where, hack to fix it.
      if (!hideNotification || this.errorFetchingData) {
        this.$('gelato-component').css({display: 'block'});
      }
    }
  }

});

module.exports = ExpiredNotificationComponent;
