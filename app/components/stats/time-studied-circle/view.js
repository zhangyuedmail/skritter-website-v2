var GelatoComponent = require('gelato/component');

/**
 * A circle graph that displays the retention percentage, minutes per day,
 * and number of days studied for a certain time period.
 * @class TimeStudiedCircleComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * Initializes a new circle graph component.
   * @method initialize
   * @param {Object} options a map of initial options
   * @constructor
   */
  initialize: function(options) {
    options = options || {};

    this.listenTo(this.collection, 'state:standby', this.update);

    this._graph = null;

    /**
     * The date range to filter by. If set, should have start and end properties
     * which are YYYY-MM-DD formatted date strings.
     * If not set through init options, is false and all-time stats will be used.
     * @type {Object|Boolean}
     */
    this.range = _.isObject(options.range) ? options.range : false;
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {TimeStudiedCircleComponent}
   */
  render: function() {
    this.renderTemplate();
    this.renderGraph();

    return this;
  },

  /**
   * Instantiates a new instance of the graph with some default values.
   * @method renderGraph
   */
  renderGraph: function() {
    var self = this;
    var $circle = this.$('#circle');

    $circle.highcharts({
      chart: {
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          borderWidth: 0
        }
      },
      series: [{
        name: ' ',
        animation: true,
        colorByPoint: true,
        data: [
          {name: "Studied", color: '#c5da4b', y: 0},
          {name: "Didn't Study", color: '#efeef3', y: 7}
        ],
        innerSize: '80%'
      }],
      title: {
        text: '',
        align: 'center',
        style: {
          color: '#87a64b',
          background: '#FFFFFF',
          fontSize: '24px',
          fontWeight: '300'
        },
        verticalAlign: 'middle',
        y: 0
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> days'
      }
    });

    this._graph = $circle.highcharts();
  },

  /**
   * Updates the data and axes when needed and redraws the graph.
   * @method update
   */
  update: function() {
    if (!this.collection.length) {
      return;
    }

    // time studied
    var timeStudied = this.collection.getTimeStudiedForPeriod(this.range.start, this.range.end, true);
    var avgTimeStudied = this.collection.convertToLargestTimeUnit(timeStudied / 7);
    this.$('#num-time-per-day').text(Number(avgTimeStudied.amount.split(':')[0]));
    this.$('#time-per-day-units').text(avgTimeStudied.units + ' per day');

    // retention rate
    var retentionRate = this.collection.getRetentionRateForPeriod(
      this.range.start, this.range.end, 'word', 'rune');
    this.$('#num-retention-rate').text(Math.round(retentionRate) + '%');

    // circle inner vals
    var daysStudied = this.collection.getNumDaysStudiedInPeriod(this.range.start, this.range.end);
    this.$('#num-days-studied').text(daysStudied);

    // circle graph
    var daysNotStudied = 7 - daysStudied;

    this._graph.series[0].setData([
      {name: "Studied", color: '#c5da4b', y: daysStudied},
      {name: "Didn't Study", color: '#efeef3', y: daysNotStudied}
    ], true);
  }
});
