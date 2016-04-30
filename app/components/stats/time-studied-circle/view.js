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
/*
    $circle.highcharts({
      chart: {
        type: 'solidgauge'
      },
      colors: ['#87a64b'],
      title: null,
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Move
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
          borderWidth: 0
        }, { // Track for Exercise
          outerRadius: '87%',
          innerRadius: '63%',
          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.3).get(),
          borderWidth: 0
        }, { // Track for Stand
         outerRadius: '62%',
          innerRadius: '38%',
          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
          borderWidth: 0
        }]
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          linecap: 'round'
        }
      },
      credits: {
        enabled: false
      },
      series: [{
            name: 'Move',
            borderColor: Highcharts.getOptions().colors[0],
            data: [{
                color: Highcharts.getOptions().colors[0],
                radius: '100%',
                innerRadius: '100%',
                y: 80
            }]
        }]
    });


    this._graph = $circle.highcharts();
    */
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

    // circle & vals
    var daysStudied = this.collection.getNumDaysStudiedInPeriod(this.range.start, this.range.end);
    this.$('#num-days-studied').text(daysStudied);
  }
});
