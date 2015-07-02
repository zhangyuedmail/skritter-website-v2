var GelatoComponent = require('gelato/modules/component');

/**
 * @class GoalDoughnut
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
        this.listenTo(app.user.data.stats, 'update', this.updateDoughnut);
        this.on('resize', this.resize);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/goal-doughnut/template'),
    /**
     * @method render
     * @returns {GoalDoughnut}
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
                renderTo: this.$component.get(0),
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
                verticalAlign: 'middle',
                y: 0
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            }
        });
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
     * @returns {GoalDoughnut}
     */
    remove: function() {
        this.doughnut.destroy();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method resize
     */
    resize: function() {
        this.doughnut.setSize(this.getSize(), this.getSize());
    },
    /**
     * @method updateDoughnut
     */
    updateDoughnut: function() {
        var goal = app.user.settings.getGoal();
        var percent = 0;
        var type = '';
        switch (goal.type) {
            case 'items':
                percent = app.user.data.stats.getGoalItemPercent();
                break;
            case 'time':
                type = 'Time';
                percent = app.user.data.stats.getGoalTimePercent();
                break;
        }
        this.doughnut.setTitle({
            text: goal.type.toUpperCase(),
            align: 'center',
            verticalAlign: 'middle',
            y: 0
        });
        this.doughnut.series[0].setData([
            {name: "Completed", color: '#c5da4b', y: percent},
            {name: "Remaining", color: '#efeef3', y: 100 - percent}
        ]);
    }
});
