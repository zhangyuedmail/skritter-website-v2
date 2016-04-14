var GelatoComponent = require('gelato/component');

/**
 * @class StatsHeatmapComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   *
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.heatmap = new CalHeatMap();
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

  renderGraph: function() {
    this.heatmap.init({
      cellSize: 22,
      cellPadding: 5,
      cellRadius: 25,
      domain: 'month',
      domainDynamicDimension: false,
      domainGutter: 20,
      itemSelector: '#heatmap',
      legend: [0, 50, 100, 200],
      range: 1,
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      subDomain: 'x_day',
      subDomainTextFormat: "%d"
    });

    this.update();
  },

  update: function() {
    this.heatmap.update(this.collection.getMonthlyHeatmapData());
    this.$('#current-streak').text(this.collection.getMonthlyStreak(true));
    this.$('#longest-streak').text(this.collection.getMonthlyStreak());

    var avgTimeStudied = this.collection.getAverageTimeStudied();
    this.$('#avg-time-studied-amount').text(avgTimeStudied.amount);
    this.$('#avg-time-studied-units').text(avgTimeStudied.units);

    var itemsLearned = this.collection.getItemsLearnedForPeriod('word', 'month') +
      this.collection.getItemsLearnedForPeriod('char', 'month');
    this.$('#items-studied').text(itemsLearned);
  }
});
