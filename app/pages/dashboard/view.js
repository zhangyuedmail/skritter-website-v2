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

    mixpanel.track('Viewed dashboard page');
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

    return this;
  }
});
