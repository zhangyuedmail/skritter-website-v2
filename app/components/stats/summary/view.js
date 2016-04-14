var GelatoComponent = require('gelato/component');

var StatsAllTimeComponent = require('components/stats/all-time/view');
var StatsHeatmapComponent = require('components/stats/heatmap/view');
/**
 * A component that is a composite of graphs which show user study statistics
 * for all time.
 * @class StatsSummaryComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   *
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this._views = {};
    this._views['allTime'] = new StatsAllTimeComponent({
      collection: this.collection
    });
    this._views['heatmap'] = new StatsHeatmapComponent({
      collection: this.collection
    });

    this.listenTo(this.collection, 'state:standby', this.updateGraphs);
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
  },

  updateGraphs: function() {

  }
});
