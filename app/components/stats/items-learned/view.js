var GelatoComponent = require('gelato/component');

/**
 * @class StatsAllTimeComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   *
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.title = _.isString(options.title) ? options.title : 'All Time';
    this.showNumReviews = _.isBoolean(options.showNumReviews) ? options.showNumReviews : true;
    this.showDaysStudied = _.isBoolean(options.showDaysStudied) ? options.showDaysStudied : true;

    this.listenTo(this.collection, 'state:standby', this.update);
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
    this.renderChart();

    return this;
  },

  renderChart: function() {
    this.$('#items-learned').highcharts({
      chart: {
        backgroundColor: null,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        spacing: [0, 0, 0, 0]
      },
      colors: ['#87a64b', '#c5da4b'],
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          borderWidth: 0
        }
      },
      series: [{
        title: null,
        colorByPoint: true,
        data: [{
          name: 'Words',
          y: 0
        }, {
          name: 'Characters',
          y: 0
        }],
        states: {
          hover: {
            enabled: false,
            halo: {
              size: 0
            }
          }
        }
      }],
      title: {
        text: null
      },
      tooltip: {
        enabled: false
      }

    });
  },

  update: function() {
    var totalCharactersLearned = this.collection.getAllTimeCharactersLearned();
    var totalWordsLearned = this.collection.getAllTimeWordsLearned();
    var totalItemsLearned = totalCharactersLearned + totalWordsLearned;

    var chartData = this.$('#items-learned').highcharts();
    if (chartData) {
      chartData = chartData.series[0].points;
    } else {
      return;
    }
    chartData[0].update(totalWordsLearned);
    chartData[1].update(totalCharactersLearned);

    this.$('#characters-learned').text(totalCharactersLearned);
    this.$('#words-learned').text(totalWordsLearned);
    this.$('#num-items-learned').text(totalItemsLearned);

    var totalTimeData = this.collection.getAllTimeTimeStudied();
    this.$('#total-time-studied-num').text(totalTimeData.amount);
    this.$('#units-total-label').text(totalTimeData.units);

    this.$('#total-reviews-num').text(this.collection.getCountAllTimeReviews());
  }
});
