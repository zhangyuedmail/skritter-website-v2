var GelatoComponent = require('gelato/modules/component');

/**
 * @class DashboardGoal
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.doughnut = null;
        this.listenTo(app.user.settings, 'change:goals', this.updateDoughnut);
        this.listenTo(app.user.data.items, 'fetch:daily', this.updateItems);
        this.listenTo(app.user.data.stats, 'fetch', this.updateDoughnut);
        this.listenTo(app.user.data.stats, 'fetch', this.updateItems);
        this.on('resize', this.resize);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/dashboard-goal/template'),
    /**
     * @method render
     * @returns {DashboardGoal}
     */
    render: function() {
        this.renderTemplate();
        this.doughnut = new Highcharts.Chart({
            chart: {
                backgroundColor: 'transparent',
                height: this.getSize(),
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo: 'goal-doughnut',
                type: 'pie',
                width: this.getSize()
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                name: "Goal",
                animation: false,
                colorByPoint: true,
                data: [
                    {name: "Completed", color: '#c5da4b', y: 0},
                    {name: "Remaining", color: '#efeef3', y: 100}
                ],
                innerSize: '80%'
            }],
            title: {
                text: '',
                align: 'center',
                style: {
                    color: '#87a64b',
                    fontSize: '24px',
                    fontWeight: '300'
                },
                verticalAlign: 'middle',
                y: 0
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            }
        });
        this.updateDoughnut();
        this.updateItems();
        return this;
    },
    /**
     * @method getSize
     * @returns {Number}
     */
    getSize: function() {
        return this.$el.width() > 200 ? 200 : this.$el.width();
    },
    /**
     * @method remove
     * @returns {DashboardGoal}
     */
    remove: function() {
        this.doughnut.destroy();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method resize
     */
    resize: function() {
        this.doughnut.setSize(this.getSize(), this.getSize(), true);
    },
    /**
     * @method updateDoughnut
     */
    updateDoughnut: function() {
        var goal = app.user.settings.getGoal();
        var percent = 0;
        switch (goal.type) {
            case 'items':
                var totalReviews = app.user.data.stats.getDailyItemsReviewed();
                this.doughnut.setTitle({
                    text: totalReviews + '<br>items',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 0
                });
                percent = app.user.data.stats.getGoalItemPercent();
                break;
            case 'time':
                var totalTime = app.user.data.stats.getDailyTimeStudied();
                this.doughnut.setTitle({
                    text: moment(totalTime * 1000).format('mm:ss') + '<br>minutes',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 0
                });
                percent = app.user.data.stats.getGoalTimePercent();
                break;
        }
        this.doughnut.series[0].setData([
            {name: "Completed", color: '#c5da4b', y: percent},
            {name: "Remaining", color: '#efeef3', y: 100 - percent}
        ], true);
    },
    /**
     * @method updateItems
     */
    updateItems: function() {
        if (app.user.data.items.length) {
            this.$('#items-added .value').text(app.user.data.items.getAddedCount());
        }
        if (app.user.data.stats.length) {
            this.$('#items-reviewed .value').text(app.user.data.stats.getDailyItemsReviewed());
        }
    }
});
