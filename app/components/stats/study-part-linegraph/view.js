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

    this.range = options.range || false;
    this.type = options.type || 'char';
    this.part = options.part || 'rune';

    this._graph = null;

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

    var rangeData = this.getRangeData();

    // total change number
    var totalStr = "";
    if (rangeData.totalChangeLearned > 0) {
      totalStr = "+";
    } else if (rangeData.totalChangeLearned < 0) {
      totalStr = "-";
    }
    totalStr += rangeData.totalChangeLearned;

    // graph
    var chartData = this._graph.series[0];
    chartData.setData(rangeData.chartData);


    this.$('#num-learned').text(totalStr)
      .toggleClass('good', rangeData.totalChangeLearned > 0)
      .toggleClass('bad', rangeData.totalChangeLearned < 0);

    this.$('#num-added').text(rangeData.added).toggleClass('good', rangeData.added > 0);
    this.$('#num-reviews').text(rangeData.studied).toggleClass('good', rangeData.studied > 0);
    this.$('#num-retention').text(rangeData.retentionRate + '%')
      .toggleClass('excellent', rangeData.retentionRate > 95)
      .toggleClass('good', rangeData.retentionRate > 80)
      .toggleClass('okay', rangeData.retentionRate > 60)
      .toggleClass('bad', rangeData.retentionRate <= 60);
  },

  getRangeData: function() {
    var chartData = [];
    var total = 0;
    var length = this.collection.length > 6 ? 6 : this.collection.length - 1;
    var studied = 0;
    var remembered = 0;
    var retentionRate = 0;
    var stats = [];

    for (var i = length; i >= 0; i--) {
      var stat = this.collection.at(i).get(this.type)[this.part];
      stats.push(stat);
      chartData.push(stat.learned.day);
      total += stat.learned.day;
      studied += stat.studied.day;
      remembered += stat.remembered.day;
    }

    // wonky 1000 / 10 division to get first decimal place
    retentionRate = studied === 0 ? 0 : (Math.floor((remembered / studied) * 1000) / 10);

    return {
      chartData: chartData,
      totalChangeLearned: total,
      studied: studied,
      remembered: remembered,
      retentionRate: retentionRate,
      added: this._getAdded(stats)
    };
  },

  _getAdded: function(stats) {
    var start = stats[0];
    var end = stats[stats.length - 1];

    var addedStartDate = start.learned.all + start.learning.all;
    var addedEndDate = end.learned.all + end.learning.all;
    var totalAdded = addedEndDate - addedStartDate;

    return totalAdded;
  }
});
