var GelatoComponent = require('gelato/component');

/**
 * A line graph that displays the progress of a specific study part (reading,
 * writing, definition, tone) for a certain time period.
 * @class StudyPartLinegraphComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * Initializes a new line graph component.
   * @method initialize
   * @param {Object} options a map of initial options
   * @constructor
   */
  initialize: function(options) {
    options = options || {};

    this.listenTo(this.collection, 'state:standby', this.update);

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
   * Instantiates a new instance of the graph with some default values.
   * @method renderGraph
   */
  renderGraph: function() {
    var self = this;
    var $linegraph = this.$('#linegraph');

    $linegraph.highcharts({
      chart: {
        type: 'spline'
      },
      colors: ['#87a64b'],
      title: null,
      yAxis: {
        title: {
          text: ''
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
         enabled: false
        },
        minorTickLength: 0,
        tickLength: 0
      },
      xAxis: {
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
          enabled: false
        },
        minorTickLength: 0,
        tickLength: 0
      },
      credits: {
        enabled: false
      },
      series: [{
        data: [0, 0, 0, 0, 0, 0, 0],
        showInLegend: false
      }]
    });

    this._graph = $linegraph.highcharts();
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

    for (var i = length; i >= 0; i--) {
      var stat = this.collection.at(i);
      data.push(Math.floor(stat.get('timeStudied').day * 1000));
    }

    chartData.setData(data);
  }
});
