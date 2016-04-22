var GelatoComponent = require('gelato/component');
var Vocablists = require('collections/vocablists');

/**
 * @class DashboardQueue
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.vocablists = new Vocablists();
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
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {DashboardQueue}
   */
  render: function() {
    this.renderTemplate();
    return this;
  }
});
