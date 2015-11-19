var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var DashboardMonth = require('components/dashboard-month/view');
var DashboardTotal = require('components/dashboard-total/view');
var DashboardQueue = require('components/dashboard-queue/view');
var DashboardGoal = require('components/dashboard-status/view');

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
        this.navbar = new DefaultNavbar();
        this.dashboardMonth = new DashboardMonth();
        this.dashboardTotal = new DashboardTotal();
        this.dashboardQueue = new DashboardQueue();

        //TODO: change to dashboard goal component
        this.dashboardGoal = new DashboardGoal();
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
     * @returns {Page}
     */
    remove: function() {
        this.dashboardGoal.remove();
        this.dashboardMonth.remove();
        this.dashboardTotal.remove();
        this.dashboardQueue.remove();
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
