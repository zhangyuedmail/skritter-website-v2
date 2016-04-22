var GelatoComponent = require('gelato/component');
var ProgressStats = require('collections/progress-stats');

/**
 * @class DashboardMonth
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.heatmap = new CalHeatMap();
    this.stats = new ProgressStats();
    this.listenTo(this.stats, 'state:standby', this.updateHeatmap);
    this.listenTo(this.stats, 'state:standby', this.updateStreak);
    this.stats.fetchMonth();
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {DashboardMonth}
   */
  render: function() {
    this.renderTemplate();
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
    this.updateHeatmap();
    this.updateStreak();
    return this;
  },
  /**
   * @method remove
   * @returns {DashboardMonth}
   */
  remove: function() {
    this.heatmap.destroy();
    return GelatoComponent.prototype.remove.call(this);
  },
  /**
   * @method updateHeatmap
   */
  updateHeatmap: function() {
    this.heatmap.update(this.stats.getMonthlyHeatmapData());
  },
  /**
   * @method updateStreak
   */
  updateStreak: function() {
    if (this.stats.length) {
      this.$('#streak .value').text(this.stats.getMonthlyStreak());
    }
  }
});
