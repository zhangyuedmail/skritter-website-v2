const GelatoComponent = require('gelato/component');

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
    this.stats = app.user.stats;
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
   * Updates the number of items a user has learned in total
   * @method update
   */
  update: function() {
    if (this.stats.length) {
      this.$('#characters-learned .value').text(this.stats.getAllTimeCharactersLearned());
      this.$('#words-learned .value').text(this.stats.getAllTimeWordsLearned());
    }
  },

});

module.exports = DashboardTotalComponent;
