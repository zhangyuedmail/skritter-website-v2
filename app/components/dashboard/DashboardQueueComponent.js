const GelatoComponent = require('gelato/component');

/**
 * @class DashboardQueueComponent
 * @extends {GelatoComponent}
 */
const DashboardQueueComponent = GelatoComponent.extend({
  events: {
    'click #load-lists': 'handleRetryButtonClick'
  },

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
    this.errorLoadingLists = false;

    this.vocablists = app.user.vocablists;
    this.listenTo(this.vocablists, 'state', this.render);
    this.vocablists.setSort('activeCompletion');

    this.listenTo(this.vocablists, 'state:standby', () => {
      if (this.vocablists.cursor && this.vocablists.length) {
        this.fetchVocablists(this.vocablists.cursor, false);
      } else {
        this.trigger('component:loaded', 'queue');
      }
    });

    this.fetchVocablists();
  },

  /**
   * Fetches the user's list of vocablists
   * @param {String} [cursor] a cursor to use when making the request
   * @param {Boolean} [remove] whether to keep/remove items already fetched from pevious requests
   */
  fetchVocablists: function(cursor, remove) {
    const fetchOptions = {
      data: {
        limit: app.config.useV2Gets.vocablists ? null : 5,
        sort: 'studying',
        include_percent_done: 'true',
        lang: app.getLanguage(),
        languageCode: app.getLanguage()
      },
      error: () => {
        this.handleErrorLoadingLists();
      }
    };

    if (cursor) {
      fetchOptions.data['cursor'] = cursor;
    }

    if (remove !== undefined) {
      fetchOptions['remove'] = remove;
    }

    this.vocablists.fetch(fetchOptions);
  },

  /**
   * Handles when a user clicks on the retry button.
   * Triggers a request to fetch their vocab lists.
   * @param {jQuery.Event} event
   */
  handleRetryButtonClick: function(event) {
    this.fetchVocablists();
  },

  /**
   * Handles when lists fail to load
   */
  handleErrorLoadingLists: function() {
    this.errorLoadingLists = true;
    this.render();
    this.trigger('fetch-data:failed', 'queue');
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
