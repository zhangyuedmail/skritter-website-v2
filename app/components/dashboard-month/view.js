var GelatoComponent = require('gelato/component');

/**
 * @class DashboardMonth
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.heatmap = new Heatmap();
        this.listenTo(app.user.data.stats, 'fetch', this.updateHeatmap);
        this.listenTo(app.user.data.stats, 'fetch', this.updateStreak);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/dashboard-month/template'),
    /**
     * @method render
     * @returns {DashboardMonth}
     */
    render: function() {
        this.renderTemplate();
        this.heatmap.init({
            cellSize: 22,
            cellPadding: 5,
            cellRadius: 25,
            domain: 'month',
            domainDynamicDimension: false,
            domainGutter: 20,
            itemSelector: '#heatmap',
            legend: [0, 50, 100, 200],
            range: 1,
            start: new Date(2015, new Date().getMonth(), 1),
            subDomain: 'x_day',
            subDomainTextFormat: "%d"
        });
        this.updateHeatmap();
        this.updateStreak();
        return this;
    },
    /**
     * @method remove
     * @returns {DashboardMonth}
     */
    remove: function() {
        this.heatmap.destroy();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method updateHeatmap
     */
    updateHeatmap: function() {
        this.heatmap.update(app.user.data.stats.getMonthlyHeatmapData());
    },
    /**
     * @method updateStreak
     */
    updateStreak: function() {
        if (app.user.data.stats.length) {
            this.$('#streak .value').text(app.user.data.stats.getStreak());
        }
    }
});
