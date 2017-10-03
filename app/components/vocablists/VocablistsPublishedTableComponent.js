const GelatoComponent = require('gelato/component');
const Vocablists = require('collections/VocablistCollection');

/**
 * @class VocablistsPublishedTableComponents
 * @extends {GelatoComponent}
 */
const VocablistsPublishedTableComponents = GelatoComponent.extend({

  /**
   * @property events
   * @typeof {Object}
   */
  events: {
    'click .add-to-queue-link': 'handleClickAddToQueueLink',
    'click #load-more-btn': 'handleClickLoadMoreButton',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsPublishedTable'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    const self = this;

    this.vocablists = new Vocablists();
    this.listenTo(this.vocablists, 'state', this.render);
    this.vocablists.fetch({
      data: {
        include_user_names: 'true',
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
        limit: 20,
        sort: 'published',
      },
      success: function () {
        self.trigger('component:loaded', 'table');
      },
    });
  },

  /**
   * @method render
   * @returns {VocablistsPublishedTableComponents}
   */
  render: function () {
    this.renderTemplate();
    return this;
  },

  /**
   * @method handleClickAddToQueueLink
   * @param {Event} event
   */
  handleClickAddToQueueLink: function (event) {
    event.preventDefault();
    let listID = $(event.target).closest('.add-to-queue-link').data('vocablist-id');
    let vocablist = this.vocablists.get(listID);
    if (vocablist.get('studyingMode') !== 'not studying') {
      return;
    }
    vocablist.save({studyingMode: 'adding'}, {patch: true});
    this.render();
  },

  /**
   * @method handleClickLoadMoreButton
   * @param {Event} event
   */
  handleClickLoadMoreButton: function (event) {
    event.preventDefault();
    if (!this.vocablists.cursor) {
      return;
    }
    this.vocablists.fetch({
      data: {
        cursor: this.vocablists.cursor,
        include_user_names: 'true',
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
        limit: 20,
        sort: 'published',
      },
      remove: false,
    });
    this.render();
  },

  /**
   * @method searchFor
   * @param {String} value
   */
  searchFor: function (value) {
    if (value) {
      let searchStartTime;

      if (app.config.recordLoadTimes) {
       // we actually want var here because of block scoping stuff.
       searchStartTime = window.performance.now();
      }

      this.vocablists.fetch({
        data: {
          include_user_names: 'true',
          lang: app.getLanguage(),
          languageCode: app.getLanguage(),
          sort: 'search',
          q: value,
        },
        remove: true,
        success: function () {
          if (app.config.recordLoadTimes) {
            const loadTime = window.performance.now() - searchStartTime;
            app.loadTimes.pages.vocablistsSearch.push(loadTime);
          }
        },
      });
    } else {
      this.vocablists.fetch({
        data: {
          include_user_names: 'true',
          lang: app.getLanguage(),
          languageCode: app.getLanguage(),
          limit: 20,
          sort: 'published',
        },
        remove: true,
      });
    }
    this.vocablists.reset();
    this.render();
  },

});

module.exports = VocablistsPublishedTableComponents;
