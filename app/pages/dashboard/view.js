var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var DashboardMonth = require('components/dashboard/month/view');
var DashboardTotal = require('components/dashboard/total/view');
var DashboardQueue = require('components/dashboard/queue/view');
var DashboardGoal = require('components/dashboard/status/view');
var MarketingFooter = require('components/marketing/footer/view');

/**
 * @class Dashboard
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this._views = {};
    this.navbar = new DefaultNavbar();
    this.dashboardGoal = new DashboardGoal();
    this.dashboardMonth = new DashboardMonth();
    this.dashboardTotal = new DashboardTotal();
    this.dashboardQueue = new DashboardQueue();
    this._views['footer'] = new MarketingFooter({
      theme: 'theme2'
    });
  },
  /**
   * @property title
   * @type {String}
   */
  title: 'Dashboard - Skritter',
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
    this.dashboardGoal.setElement('#dashboard-goal-container').render();
    this.dashboardMonth.setElement('#dashboard-month-container').render();
    this.dashboardTotal.setElement('#dashboard-total-container').render();
    this.dashboardQueue.setElement('#dashboard-queue-container').render();
    this._views['footer'].setElement('#footer-container').render();
    this.navbar.setElement('#navbar-container').render();
    return this;
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {},
  /**
   * @method remove
   * @returns {Dashboard}
   */
  remove: function() {
    this.dashboardGoal.remove();
    this.dashboardMonth.remove();
    this.dashboardTotal.remove();
    this.dashboardQueue.remove();
    this.navbar.remove();
    this._views['footer'].remove();
    return GelatoPage.prototype.remove.call(this);
  }
});
