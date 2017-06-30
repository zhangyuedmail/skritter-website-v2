const GelatoComponent = require('gelato/component');

/**
 * A line graph that displays the progress of a specific study part (reading,
 * writing, definition, tone) for a certain time period.
 * @class StatsStudyPartLinegraphComponent
 * @extends {GelatoComponent}
 */
const StatsStudyPartLinegraphComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StatsStudyPartLinegraph'),

  /**
   * Initializes a new line graph component.
   * @method initialize
   * @param {Object} options a map of initial options
   * @constructor
   */
  initialize: function(options) {
    options = options || {};
    this.graphTitle = options.graphTitle;
    this.range = options.range || false;
    this.type = options.type || 'char';
    this.part = options.part || 'rune';
    this.partName = this.part === 'rune' ? 'writings' :
      this.part === 'defn' ? 'definitions' :
        this.part === 'rdng' ? 'readings' : 'tones';

    this._graph = null;

    this.listenTo(this.collection, 'state:standby', this.update);
  },

  /**
   * @method render
   * @returns {StatsStudyPartLinegraphComponent}
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
        type: 'spline',
        backgroundColor: 'transparent',
      },
      colors: ['#C5DA4B'],
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
        showInLegend: false,
        marker: {
          enabled: false,
          states: {
            hover: {
              radius: 5
            }
          }
        }
      }],
      tooltip: {
        formatter: function() {
          var partName = self.partName;
          var date = self._getDateFromRangeOffset(this.key);
          var verb = this.point.y >= 0 ? app.locale('pages.stats.learned') : app.locale('pages.stats.forgot');
          var absY = Math.abs(this.point.y);

          // TODO: plural hack--get a proper string key for like defnPlural or something
          partName = absY !== 1 ? partName : partName.substring(0, partName.length - 1);
          return date + ' : ' + verb + ' <b>' + absY + '</b> ' + partName;
        }
      }
    });

    this._graph = $linegraph.highcharts();
  },

  _getDateFromRangeOffset: function(offset) {
    var date = moment(this.range.start, 'YYYY-MM-DD');
    date.add(offset, 'days');

    return date.format('MM/DD');
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

    const rangeData = this.getRangeData();

    // total change number
    let totalStr = "";

    if (rangeData.totalChangeLearned > 0) {
      totalStr = "+";
    }

    totalStr += rangeData.totalChangeLearned;

    // graph
    const chartData = this._graph.series[0];
    chartData.setData(rangeData.chartData);


    this.$('#num-learned').text(totalStr !== "0" ? totalStr : '')
      .toggleClass('good', rangeData.totalChangeLearned > 0)
      .toggleClass('bad', rangeData.totalChangeLearned < 0);

    this.$('#num-added').text(rangeData.added).toggleClass('good', rangeData.added > 0);
    this.$('#num-reviews').text(rangeData.studied).toggleClass('good', rangeData.studied > 0);
    this.$('#num-retention').text(rangeData.retentionRate + '%')
      .toggleClass('excellent', rangeData.retentionRate > 95)
      .toggleClass('good', rangeData.retentionRate > 80)
      .toggleClass('okay', rangeData.retentionRate > 60)
      .toggleClass('bad', rangeData.retentionRate <= 60 && rangeData.studied > 0);
  },

  /**
   * Gets data from the collection for the specified range and organizes more meaningful data for the specified type of stat
   * @returns {{chartData: Array<Number>, totalChangeLearned: number, studied: number, remembered: number, retentionRate: number, added: *}}
   */
  getRangeData: function() {
    var chartData = [];
    var total = 0;
    var collection = this.range ? this.collection.getStatsInRange(this.range.start, this.range.end) : this.collection.models;
    var length = collection.length > 6 && !this.range ? 6 : collection.length - 1;
    var studied = 0;
    var remembered = 0;
    var retentionRate = 0;
    var stats = [];

    for (var i = length; i >= 0; i--) {
      var stat = collection[i].get(this.type)[this.part];
      stats.push(stat);
      chartData.push(stat.learned.all);
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
    if (!stats.length) {
      return 0;
    }

    var start = stats[0];
    var end = stats[stats.length - 1];

    var addedStartDate = start.learned.all + start.learning.all;
    var addedEndDate = end.learned.all + end.learning.all;
    var totalAdded = addedEndDate - addedStartDate;

    return totalAdded;
  }

});

module.exports = StatsStudyPartLinegraphComponent;
