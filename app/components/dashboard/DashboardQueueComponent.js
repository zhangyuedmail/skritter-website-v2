const GelatoComponent = require('gelato/component');

/**
 * @class DashboardQueueComponent
 * @extends {GelatoComponent}
 */
const DashboardQueueComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./DashboardQueue'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.vocablists = app.user.vocablists;
    this.listenTo(this.vocablists, 'state', this.render);
    this.vocablists.setSort('activeCompletion');
    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'studying',
        include_percent_done: 'true',
        lang: app.getLanguage()
      }
    });
  },

  /**
   * @method render
   * @returns {DashboardQueueComponent}
   */
  render: function() {
    this.renderTemplate();

    return this;
  }

});

module.exports = DashboardQueueComponent;
