var GelatoComponent = require('gelato/component');
var StatsItemsLearnedComponent = require('components/stats/items-learned/view');
var StatsHeatmapComponent = require('components/stats/heatmap/view');

/**
 * A component that is a composite of graphs which show user study statistics
 * for all time.
 * @class StatsSummaryComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * Initializes a new summary stats view
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this._views['allTime'] = new StatsItemsLearnedComponent({
      collection: this.collection,
      title: 'All Time'
    });

    this._views['heatmap'] = new StatsHeatmapComponent({
      collection: this.collection
    });
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
    this._views['allTime'].setElement('#stats-all-time-container').render();
    this._views['heatmap'].setElement('#stats-heatmap-container').render();
  }
});
