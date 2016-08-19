const GelatoComponent = require('gelato/component');
const ProgressStats = require('collections/ProgressStatsCollection');

/**
 * @class DashboardTotalComponent
 * @extends {GelatoComponent}
 */
const DashboardTotalComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./DashboardTotal'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.stats = new ProgressStats();
    this.listenTo(this.stats, 'state:standby', this.update);
    this.stats.fetchToday();
  },

  /**
   * @method render
   * @returns {DashboardTotalComponent}
   */
  render: function() {
    this.renderTemplate();
    this.update();
    return this;
  },

  /**
   * @method update
   */
  update: function() {
    if (this.stats.length) {
      this.$('#characters-learned .value').text(this.stats.getAllTimeCharactersLearned());
      this.$('#words-learned .value').text(this.stats.getAllTimeWordsLearned());
    }
  }

});

module.exports = DashboardTotalComponent;
