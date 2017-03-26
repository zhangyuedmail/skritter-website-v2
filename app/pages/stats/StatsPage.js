const GelatoPage = require('gelato/page');
const StatsSummaryComponent = require('components/stats/StatsSummaryComponent');
const StatsTimelineComponent = require('components/stats/StatsTimelineComponent');

/**
 * @class StatsPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .stats-section-selector': 'handleStatsSectionSelectorClicked'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Stats'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Stats - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
      this.loadAlreadyTimed = false;
    }

    const today = moment().format('YYYY-MM-DD');
    const lastMonth = moment().subtract(1, 'month').format('YYYY-MM-DD');

    app.user.stats.fetchRange(lastMonth, today);

    this._views['summary'] = new StatsSummaryComponent({
      collection: app.user.stats
    });
    this._views['timeline'] = new StatsTimelineComponent({
      collection: app.user.stats
    });

    if (app.config.recordLoadTimes) {
      this.componentsLoaded = {};
      for (let view in this._views) {
        this.componentsLoaded[view] = false;
        this.listenTo(this._views[view], 'component:loaded', this._onComponentLoaded);
      }
    }

    this.activeSection = 'summary';
  },

  /**
   * @method render
   * @returns {StatsPage}
   */
  render: function() {
    this.renderTemplate();
    this._views['summary'].setElement('#stats-summary-container').render();
    this._views['timeline'].setElement('#stats-timeline-container').render();

    return this;
  },

  /**
   *
   * @param {jQuery.Event} event a click event
   */
  handleStatsSectionSelectorClicked: function(event) {

    // TODO: re-enable when we have enough stats to call for dividing this into sections
    return;

    // event.preventDefault();

    const newSection = event.target.id.split('-')[0];

    if (newSection === this.activeSection) {
      return;
    }

    this.$('#' + this.activeSection + '-selector').removeClass('active');
    this.$('#' + newSection + '-selector').addClass('active');
    this.activeSection = newSection;

    this.showStatsSection();
  },

  /**
   *
   * @param {String} [section] the section to show. Defaults to activeSection.
   */
  showStatsSection: function(section) {
    const toShowSection = section || this.activeSection;
    const toHideSection = toShowSection === 'summary' ? 'timeline' : 'summary';

    this._views[toHideSection].hide();
    this._views[toShowSection].show();

    if (_.isFunction(this._views[toShowSection].onTabVisible)) {
      this._views[toShowSection].onTabVisible();
    }
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

    // but if everything's loaded, since this is a page, log the time
    this._recordLoadTime();
  },

  /**
   * Records the load time for this page once.
   * @private
   */
  _recordLoadTime: function() {
    if (this.loadAlreadyTimed || !app.config.recordLoadTimes) {
      return;
    }

    this.loadAlreadyTimed = true;
    const loadTime = window.performance.now() - this.loadStart;
    app.loadTimes.pages.stats.push(loadTime);
  }
});
