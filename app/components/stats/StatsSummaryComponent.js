const GelatoComponent = require('gelato/component');
const StatsItemsLearnedComponent = require('components/stats/StatsItemsLearnedComponent');
const StatsHeatmapComponent = require('components/stats/StatsHeatmapComponent');

/**
 * A component that is a composite of graphs which show user study statistics
 * for all time.
 * @class StatsSummaryComponent
 * @extends {GelatoComponent}
 */
const StatsSummaryComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StatsSummary'),

  /**
   * Initializes a new summary stats view
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this._views['allTime'] = new StatsItemsLearnedComponent({
      collection: this.collection,
      title: 'All Time'
    });

    this._views['heatmap'] = new StatsHeatmapComponent({
      collection: this.collection
    });
  },

  /**
   * @method render
   * @returns {StatsSummaryComponent}
   */
  render: function() {
    this.renderTemplate();
    this._views['allTime'].setElement('#stats-all-time-container').render();
    this._views['heatmap'].setElement('#stats-heatmap-container').render();
  }

});

module.exports = StatsSummaryComponent;
