var GelatoPage = require('gelato/modules/page');
var GoalDoughnut = require('components/goal-doughnut/view');
var MonthHeatmap = require('components/month-heatmap/view');
var MonthStreak = require('components/month-streak/view');

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
        this.goalDoughnut = new GoalDoughnut();
        this.monthHeatmap = new MonthHeatmap();
        this.monthStreak = new MonthStreak();
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
        this.goalDoughnut.setElement('#goal-doughnut-container').render();
        this.monthHeatmap.setElement('#month-heatmap-container').render();
        this.monthStreak.setElement('#month-streak-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {GelatoPage}
     */
    remove: function() {
        this.goalDoughnut.remove();
        this.monthHeatmap.remove();
        this.monthStreak.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
