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
      title: 'All Time',
    });

    this._views['heatmap'] = new StatsHeatmapComponent({
      collection: this.collection,
    });

    if (app.config.recordLoadTimes) {
      this.componentsLoaded = {};
      for (let component in this._views) {
        this.componentsLoaded[component] = false;
        this.listenTo(this._views[component], 'component:loaded', this._onComponentLoaded);
      }
    }
  },

  /**
   * @method render
   * @returns {StatsSummaryComponent}
   */
  render: function() {
    this.renderTemplate();
    this._views['allTime'].setElement('#stats-all-time-container').render();
    this._views['heatmap'].setElement('#stats-heatmap-container').render();
  },

  /**
   * Keeps track of which components have loaded. When everything is loaded,
   * if timing is being recorded, this calls a function to record
   * the load time.
   * @param {String} component the name of the component that was loaded
   * @private
   */
  _onComponentLoaded: function(component) {
    this.componentsLoaded[component] = true;

    // return if any component is still not loaded
    for (let component in this.componentsLoaded) {
      if (this.componentsLoaded[component] !== true) {
        return;
      }
    }

    if (!this.loaded) {
      this.loaded = true;

      // but if everything's loaded, since this is a component, trigger an event
      this.trigger('component:loaded', 'summary');
    }
  },
});

module.exports = StatsSummaryComponent;
