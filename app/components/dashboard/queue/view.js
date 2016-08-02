var GelatoComponent = require('gelato/component');
var Vocablists = require('collections/vocablists');

/**
 * @class DashboardQueue
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.vocablists = app.user.vocablists;
    this.listenTo(this.vocablists, 'state', this.render);
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
   * @returns {DashboardQueue}
   */
  render: function() {
    this.renderTemplate();

    return this;
  }
});
