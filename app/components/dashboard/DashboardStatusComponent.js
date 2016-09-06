const GelatoComponent = require('gelato/component');

/**
 * @class DashboardStatusComponent
 * @extends {GelatoComponent}
 */
const DashboardStatusComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./DashboardStatus'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.dueCount = null;
    this.vocablists = app.user.vocablists;
    this.listenTo(this.vocablists, 'state', this.render);
    this.updateDueCount();
  },

  /**
   * @method render
   * @returns {DashboardStatusComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method updateDueCount
   */
  updateDueCount: function() {
    $.ajax({
      url: app.getApiUrl() + 'items/due',
      type: 'GET',
      headers: app.user.session.getHeaders(),
      context: this,
      data: {
        lang: app.getLanguage(),
        parts: app.user.getFilteredParts().join(','),
        styles: app.user.getFilteredStyles().join(',')
      },
      error: function(error) {
        console.log(error);
        this.dueCount = '-';
        this.render();
      },
      success: function(result) {
        var count = 0;
        for (var part in result.due) {
          for (var style in result.due[part]) {
            count += result.due[part][style];
          }
        }
        this.dueCount =  count;
        this.render();
      }
    });
  }

});

module.exports = DashboardStatusComponent;
