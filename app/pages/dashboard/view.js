var GelatoPage = require('gelato/page');
var DashboardGoal = require('components/dashboard/status/view');
var DashboardMonth = require('components/dashboard/month/view');
var DashboardQueue = require('components/dashboard/queue/view');
var DashboardTotal = require('components/dashboard/total/view');

/**
 * A page that shows a summary of the user's review count due, stats, and lists
 * they're studying.
 * @class Dashboard
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  events: {
    'click #hide-sub-expired': 'handleHideSubscriptionExpiredNotice'
  },

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.dashboard.title'),

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this._views['goal'] = new DashboardGoal();
    this._views['month'] = new DashboardMonth();
    this._views['total'] = new DashboardTotal();
    this._views['queue'] = new DashboardQueue();

    // this.listenTo(app.user.subscription, 'state', this.updateSubscriptionState);
    // app.user.subscription.fetch();

    app.mixpanel.track('Viewed dashboard page');
  },

  /**
   * @method render
   * @returns {Dashboard}
   */
  render: function() {
    this.renderTemplate();

    this._views['goal'].setElement('#dashboard-goal-container').render();
    this._views['month'].setElement('#dashboard-month-container').render();
    this._views['total'].setElement('#dashboard-total-container').render();
    this._views['queue'].setElement('#dashboard-queue-container').render();

    app.user.isSubscriptionActive(_.bind(this.updateSubscriptionState, this));

    return this;
  },

  handleHideSubscriptionExpiredNotice: function(event) {
    event.preventDefault();

    app.setSetting('hideSubscriptionNotification', true);
    this.updateSubscriptionState();
  },

  updateSubscriptionState: function() {
    var sub = app.user.subscription;
    var hide = app.getSetting('hideSubscriptionNotification');

    if (sub.state === 'standby') {
      this.$('#subscription-notice').toggleClass('hidden', sub.get('subscribed') || hide);
    }
  }
});
