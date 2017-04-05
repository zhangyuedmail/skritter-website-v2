const GelatoComponent = require('gelato/component');

/**
 * Stats graph component that shows numerical information about the
 * number of items learned and optionally reviews and time spent
 * studying over a certain time period. Displays the ratio of words vs
 * characters learned in the time period in a circular graph.
 * @class StatsItemsLearnedComponent
 * @extends {GelatoComponent}
 */
const StatsItemsLearnedComponent = GelatoComponent.extend({

  /**
   * @param {Object} options initialization options used to set instance variables
   * @param {Object} [options.range] time range by which to limit the stats
   * @param {Boolean} [options.showNumReviews] whether to show the number of
   *                                           reviews studied in the time range
   * @param {Boolean} [options.showTimeStudied] whether to show the amount of
   *                                            time studied in the time range
   * @param {String} [options.title] title for the graph
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    /**
     * A title to display for the graph and stats
     * @type {string}
     */
    this.title = _.isString(options.title) ? options.title : '';

    /**
     * Whether to display a stat about the amount number of reviews studied in
     * the time period.
     * @type {Boolean}
     */
    this.showNumReviews = _.isBoolean(options.showNumReviews) ? options.showNumReviews : true;

    /**
     * Whether to display a stat about the amount of time studied in the
     * specified period.
     * @type {Boolean}
     */
    this.showTimeStudied = _.isBoolean(options.showTimeStudied) ? options.showTimeStudied : true;

    /**
     * The date range to filter by. If set, should have start and end properties
     * which are YYYY-MM-DD formatted date strings.
     * If not set through init options, is false and all-time stats will be used.
     * @type {Object|Boolean}
     */
    this.range = _.isObject(options.range) ? options.range : false;

    this.listenTo(this.collection, 'state:standby', this.update);
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StatsItemsLearned'),

  /**
   * @method render
   * @returns {StatsItemsLearnedComponent}
   */
  render: function() {
    this.renderTemplate();
    this.renderChart();

    return this;
  },

  /**
   * Gets the number of characters learned for the component's time range
   * @returns {Number} the number of characters learned
   */
  getCharactersLearned: function() {
    if (!this.range) {
      return this.collection.getAllTimeCharactersLearned();
    }

    return this.collection.getSumItemsLearnedForPeriod('char', this.range.start, this.range.end);
  },

  /**
   * Gets the number of words learned for the component's time range
   * @returns {Number} the number of characters learned
   */
  getWordsLearned: function() {
    if (!this.range) {
      return this.collection.getAllTimeWordsLearned();
    }

    return this.collection.getSumItemsLearnedForPeriod('word', this.range.start, this.range.end);
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

  /**
   * Sets a new date range for the component.
   * @param {Object} range
   */
  setRange: function(range) {
    this.range = range;
    this.update();
  },

  /**
   * Updates display of graph and data when the collection changes.
   */
  update: function() {
    const totalCharactersLearned = this.getCharactersLearned();
    const totalWordsLearned = this.getWordsLearned();
    const totalItemsLearned = Math.max(totalCharactersLearned, 0) + Math.max(totalWordsLearned, 0);

    const chartData = this.$('#items-learned').highcharts().series[0].points;
    chartData[0].update(Math.max(totalWordsLearned, 0));
    chartData[1].update(Math.max(totalCharactersLearned, 0));

    this.$('#characters-learned').text(totalCharactersLearned);
    this.$('.words-learned').text(totalWordsLearned);
    this.$('#num-items-learned').text(totalItemsLearned);

    if (this.showTimeStudied) {
      const totalTimeData = this.collection.getAllTimeTimeStudied();
      this.$('#total-time-studied-num').text(totalTimeData.amount);
      this.$('#units-total-label').text(totalTimeData.units);
    }

    if (this.showNumReviews) {
      this.$('.total-reviews-num').text(this.collection.getCountAllTimeReviews());
    }

    if (!this.loaded) {
      this.loaded = true;
      this.trigger('component:loaded', 'allTime');
    }
  }

});

module.exports = StatsItemsLearnedComponent;
