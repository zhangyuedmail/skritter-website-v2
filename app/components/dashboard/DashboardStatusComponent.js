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
    this.errorFetchingDueCount = false;
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
    let url = app.getApiUrl() + 'items/due';

    if (app.config.useV2Gets.itemsdue) {
      url = app.getApiUrl(2) + 'gae/items/due';
    }
    $.ajax({
      url: url,
      type: 'GET',
      headers: app.user.session.getHeaders(),
      context: this,
      data: {
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
        parts: app.user.getFilteredParts().join(','),
        styles: app.user.getFilteredStyles().join(',')
      },
      error: function(error) {
        this.dueCount = '-';
        this.errorFetchingDueCount = true;
        this.render();
        this.trigger('fetch-data:failed', 'goal');
      },
      success: function(result) {
        let count = 0;
        for (let part in result.due) {
          for (let style in result.due[part]) {
            count += result.due[part][style];
          }
        }
        this.dueCount = count;
        this.render();
        this.trigger('component:loaded', 'goal');
      }
    });
  }

});

module.exports = DashboardStatusComponent;
