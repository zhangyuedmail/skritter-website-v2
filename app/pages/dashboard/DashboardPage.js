const GelatoPage = require('gelato/page');
const DashboardGoal = require('components/dashboard/DashboardStatusComponent');
const DashboardMonth = require('components/dashboard/DashboardMonthComponent');
const DashboardQueue = require('components/dashboard/DashboardQueueComponent');
const DashboardTotal = require('components/dashboard/DashboardTotalComponent');
const ExpiredNotification = require('components/account/AccountExpiredNotificationComponent');

/**
 * A page that shows a summary of the user's review count due, stats, and lists
 * they're studying.
 * @class Dashboard
 * @extends {GelatoPage}
 */
const DashboardPage = GelatoPage.extend({

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.dashboard.title'),

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Dashboard'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this._views['goal'] = new DashboardGoal();
    this._views['month'] = new DashboardMonth();
    this._views['total'] = new DashboardTotal();
    this._views['queue'] = new DashboardQueue();
    this._views['expiration'] = new ExpiredNotification();

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
    this._views['expiration'].setElement('#subscription-notice').render();

    return this;
  }
});

module.exports = DashboardPage;
