const GelatoComponent = require('gelato/component');
const Vocablists = require('collections/VocablistCollection');

/**
 * @class VocablistsMineTableComponent
 * @extends {GelatoComponent}
 */
const VocablistsMineTableComponent = GelatoComponent.extend({

  /**
   * @property events
   * @typeof {Object}
   */
  events: {
    'click #load-more-btn': 'handleClickLoadMoreButton',
    'click .add-to-queue-link': 'handleClickAddToQueueLink',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: app.isMobile() ? require('./MobileVocablistsMineTable') : require('./VocablistsMineTable'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.vocablists = new Vocablists();
    this.listenTo(this.vocablists, 'state', this.render);
    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'custom',
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
      },
    });
  },

  /**
   * @method render
   * @returns {VocablistsMineTableComponent}
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
    vocablist.save({'studyingMode': 'adding'}, {patch: true});
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
        limit: 10,
        sort: 'custom',
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
      },
      remove: false,
    });
    this.render();
  },

});

module.exports = VocablistsMineTableComponent;
