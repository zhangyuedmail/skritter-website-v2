var GelatoComponent = require('gelato/component');

/**
 * @class StatsTimeStudiedBargraphComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     *
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.listenTo(this.collection, 'state:standby', this.update);

        this.now = moment();
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistSideBar}
     */
    render: function() {
        this.renderTemplate();
        this.renderGraph();
    },
    
    renderGraph: function() {
        // TODO: figure out date formats for graph
        this.$('#bargraph').highcharts({
            chart: {
                type: 'column'
            },
            colors: ['#87a64b'],
            title: null,
            xAxis: {
                categories: this._getLastWeekLabels()
            },
            yAxis: {
                type: 'datetime',
                min: this.now.toDate()
            },
            credits: {
                enabled: false
            },
            series: [{
                data: [0, 0, 0, 0, 0, 0, 0]
            }],
            dateTimeLabelFormats: {
                second: '%H:%M:%S',
                minute: '%H:%M:%S',
                hour: '%H:%M:%S',
                day: '%H:%M:%S'
            }
        });
    },
    
    update: function() {
        var chartData = this.$('#bargraph').highcharts().series[0];

        // TODO: figure out date formats for graph
        chartData.setData([
            this.now.add(1, 'hours').toDate(),
            this.now.add(2, 'hours').toDate(),
            this.now.add(3, 'hours').toDate(),
            this.now.add(4, 'hours').toDate(),
            this.now.add(5, 'hours').toDate(),
            this.now.add(6, 'hours').toDate(),
            this.now.add(7, 'hours').toDate()
        ]);
    },

    redrawGraph: function() {
        // TODO--cool intro animation when user tabs over
        /*
        var chartData = this.$('#bargraph').highcharts().series[0];
        var data = chartData.yData;
        chartData.setData([]);
        chartData.setData(data);
        */
    },

    _getLastWeekLabels: function() {
        var dates = [];
        for (var i = 6; i >= 0; i--) {
            dates.push(moment().subtract(i, 'days').format('dddd <br> M/D'));
        }

        return dates;
    }
});