var GelatoPage = require('gelato/page');
var DashboardGoal = require('components/dashboard-goal/view');
var DashboardMonth = require('components/dashboard-month/view');
var DashboardStatus = require('components/dashboard-status/view');
var DashboardTotal = require('components/dashboard-total/view');
var DashboardQueue = require('components/dashboard-queue/view');
var GoalSettingsDialog = require('dialogs/goal-settings/view');
var DefaultNavbar = require('navbars/default/view');
var MobileDashboardNavbar = require('navbars/mobile-dashboard/view');

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
        this.mobileNavbar = new MobileDashboardNavbar();
        this.navbar = new DefaultNavbar();

        //TODO: replace dashboard status with goal
        this.dashboardGoal = new DashboardStatus();
        this.dashboardMonth = new DashboardMonth();
        this.dashboardTotal = new DashboardTotal();
        this.dashboardQueue = new DashboardQueue();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Dashboard - Skritter',
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
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
        this.navbar.render();
        // this.mobileNavbar.setElement('#dashboard-mobile-navbar-container').render();
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-goal-settings': 'handleClickGoalSettings'
    },
    /**
     * @method handleClickGoalSettings
     * @param {Object} event
     */
    handleClickGoalSettings: function(event) {
        event.preventDefault();
        this.dialog = new GoalSettingsDialog();
        this.dialog.open();
    },
    /**
     * @method remove
     * @returns {GelatoPage}
     */
    remove: function() {
        this.dashboardGoal.remove();
        if (!app.isMobile()) {
          this.dashboardMonth.remove();
          this.dashboardTotal.remove();
          this.navbar.remove();
        }
        this.dashboardQueue.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
