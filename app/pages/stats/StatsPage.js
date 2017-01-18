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
    const today = moment().format('YYYY-MM-DD');
    const lastMonth = moment().subtract(1, 'month').format('YYYY-MM-DD');

    app.user.stats.fetchRange(lastMonth, today);

    this._views['summary'] = new StatsSummaryComponent({
      collection: app.user.stats
    });
    this._views['timeline'] = new StatsTimelineComponent({
      collection: app.user.stats
    });

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
  }
});
