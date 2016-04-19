var GelatoComponent = require('gelato/component');

/**
 * A bargraph that displays the amount of time a user has studied over
 * a certain 7-day period.
 * @class StatsTimeStudiedBargraphComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * Initializes a new bargraph component. Sets the initial granularity.
   * @method initialize
   * @param {Object} options a map of initial options
   * @param {String} [options.granularity] the initial granularity of the graph.
   *                                       Defaults to "minutes".
   * @constructor
   */
  initialize: function(options) {
    options = options || {};

    this.listenTo(this.collection, 'state:standby', this.update);

    this._granularity = options.granularity || 'minutes';
    this._graph = null;
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

    return this;
  },

  /**
   * Gets the text label for the y-axis based on the current time unit granularity
   * @returns {String} the label for the y-axis at the current granularity level
   * @method getYAxisLabelText
   */
  getYAxisLabelText: function() {
    // TODO: i18n
    return this._granularity === 'hours' ? 'hours:min' : 'min:sec';
  },

  /**
   * Instantiates a new instance of the graph with some default values.
   * @method renderGraph
   */
  renderGraph: function() {
    var self = this;
    var $bargraph = this.$('#bargraph');

    $bargraph.highcharts({
      chart: {
        type: 'column'
      },
      colors: ['#87a64b'],
      title: null,
      xAxis: {
        categories: this._getLastWeekLabels()
      },
      yAxis: {
        dateTimeLabelFormats: this._getYAxisDateTimeLabelFormats(),
        type: 'datetime',
        title: {
          text: this.getYAxisLabelText()
        }
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
        formatter: function() {
          var time = self.collection.convertToLargestTimeUnit(Math.floor(this.point.y / 1000));
          var amount = time.amount.split(':');
          
          return amount[0] + ' ' + time.units + ' ' + amount[1] + ' ' + time.secondaryUnits + ' studied';
        }
      }
    });

    this._graph = $bargraph.highcharts();
  },

  /**
   * @method redrawGraph
   */
  redrawGraph: function() {
    // TODO--cool intro animation when user tabs over
    /*
     var chartData = this.$('#bargraph').highcharts().series[0];
     var data = chartData.yData;
     chartData.setData([]);
     chartData.setData(data);
     */
  },

  /**
   * Sets the label and units text on the y-axis of the graph
   * @param {String} [text] the new label for the y-axis text.
   *                        Defaults to units based on granularity.
   * @method setYAxisLabelText
   */
  setYAxisLabelText: function(text) {
    this._graph.yAxis[0].update({
      title: {
        text: text || this.getYAxisLabelText()
      },
      dateTimeLabelFormats: this._getYAxisDateTimeLabelFormats()
    });
  },

  /**
   * Updates the data and axes when needed and redraws the graph.
   * @method update
   */
  update: function() {
    if (!this.collection.length) {
      return;
    }

    var chartData = this._graph.series[0];
    var data = [];
    var length = this.collection.length > 6 ? 6 : this.collection.length - 1;
    this.setYAxisLabelText();

    for (var i = length; i >= 0; i--) {
      var stat = this.collection.at(i);
      data.push(Math.floor(stat.get('timeStudied').day * 1000));
    }

    chartData.setData(data);
  },

  /**
   * Redraws the graph at a certain level of granularity
   * @param {String} newUnits whether to show the graph in "minutes" or "hours"
   * @method updateUnits
   */
  updateUnits: function(newUnits) {
    if (newUnits === this._granularity) {
      return;
    }

    this._granularity = newUnits;
    this.update();
  },

  /**
   * Gets the DateTime label format for the y-axis based on the current time unit granularity
   * @returns {Object<String, String>} the label formats for the date and time
   * @private
   */
  _getYAxisDateTimeLabelFormats: function() {
    var dateTimeLabelFormat = this._granularity === 'hours' ? '%H:%M' : '%M:%S';

    return {
      millisecond: dateTimeLabelFormat,
      second: dateTimeLabelFormat,
      minute: dateTimeLabelFormat,
      hour: dateTimeLabelFormat,
      day: dateTimeLabelFormat,
      week: dateTimeLabelFormat,
      month: dateTimeLabelFormat,
      year: dateTimeLabelFormat
    };
  },

  /**
   * Gets a list of the past 7 days (including the current day)
   * @returns {Array<String>} the reverse-ordered list of dates, starting at
   *                          the least recent one in position 0 and the
   *                          current date in the last position.
   * @private
     */
  _getLastWeekLabels: function() {
    var dates = [];
    for (var i = 6; i >= 0; i--) {
      dates.push(moment().subtract(i, 'days').format('dddd <br> M/D'));
    }

    return dates;
  }
});
