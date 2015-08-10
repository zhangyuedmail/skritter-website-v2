var GelatoPage = require('gelato/page');
var DashboardGoal = require('components/dashboard-goal/view');
var DashboardMonth = require('components/dashboard-month/view');
var DashboardTotal = require('components/dashboard-total/view');
var VocablistTable = require('components/vocablist-table/view');
var GoalSettingsDialog = require('dialogs/goal-settings/view');

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
        this.dashboardGoal = new DashboardGoal();
        this.dashboardMonth = new DashboardMonth();
        this.dashboardTotal = new DashboardTotal();
        this.vocablistTable = new VocablistTable();
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
    template: require('pages/dashboard/template'),
    /**
     * @method render
     * @returns {Dashboard}
     */
    render: function() {
        this.renderTemplate();
        this.dashboardGoal.setElement('#dashboard-goal-container').render();
        this.dashboardMonth.setElement('#dashboard-month-container').render();
        this.dashboardTotal.setElement('#dashboard-total-container').render();
        this.vocablistTable.setElement('#vocablist-table-container').render();
        this.vocablistTable.setType('adding');
        app.user.data.items.fetchDaily();
        app.user.data.items.fetchNext();
        app.user.data.stats.fetchMonth();
        app.user.data.vocablists.fetchAdding();
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
        this.dashboardMonth.remove();
        this.dashboardTotal.remove();
        this.vocablistTable.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
