const GelatoComponent = require('gelato/component');
const ProgressStats = require('collections/ProgressStatsCollection');

/**
 * @class DashboardMonthComponent
 * @extends {GelatoComponent}
 */
const DashboardMonthComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./DashboardMonth'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    const self = this;

    this.heatmap = new CalHeatMap();
    this.stats = app.user.stats;
    this.listenTo(this.stats, 'state:standby', this.statsFetched);
    this.stats.fetchMonth(function() {
      self.trigger('component:loaded', 'month');
    });
  },

  /**
   * @method render
   * @returns {DashboardMonthComponent}
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
      subDomainTextFormat: '%d',
    });
    this.updateHeatmap();
    this.updateStreak();
    return this;
  },

  /**
   * @method remove
   * @returns {DashboardMonthComponent}
   */
  remove: function() {
    this.heatmap.destroy();
    return GelatoComponent.prototype.remove.call(this);
  },


  /**
   * Reacts to the stats being loaded and triggers an event that the loading
   * of all the component's data has completed.
   */
  statsFetched: function() {
    this.updateHeatmap();
    this.updateStreak();
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
  },
});

module.exports = DashboardMonthComponent;
