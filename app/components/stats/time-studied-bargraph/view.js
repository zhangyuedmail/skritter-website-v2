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
        dateTimeLabelFormats: {
          second: '%H:%M',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%H:%M',
          week: '%H:%M',
          month: '%H:%M',
          year: '%H:%M'
        },
        type: 'datetime',
        title: {
          text: 'hours:min'
        }
        // min: this.now.valueOf()
      },
      credits: {
        enabled: false
      },
      series: [{
        data: [0, 0, 0, 0, 0, 0, 0],
        showInLegend: false
      }],

      tooltip: {
        useHTML: true,
        pointFormat: '{point.y} seconds studied'
      }
    });
  },

  update: function() {

    if (!this.collection.length) {
      return;
    }

    var chartData = this.$('#bargraph').highcharts().series[0];
    var data = [];
    var length = this.collection.length > 6 ? 6 : this.collection.length - 1;

    for (var i = length; i >= 0; i--) {
      var stat = this.collection.at(i);
      data.push(Math.floor(stat.get('timeStudied').day * 1000));
    }

    chartData.setData(data);
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
