const GelatoComponent = require('gelato/component');
const Vocablists = require('collections/VocablistCollection');
const Vocablist = require('models/VocablistModel');

/**
 * @class DashboardListsComponent
 * @extends {GelatoComponent}
 */
const DashboardListsComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object} events
   */
  events: {
    'click .button-sections': 'handleClickVocablistSections',
    'click .button-show-lists': 'handleClickShowLists'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./DashboardLists'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.vocablist = null;
    this.vocablists = new Vocablists();
    this.listenTo(this.vocablists, 'state', this.render);
    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'adding',
        include_percent_done: 'true',
        lang: app.getLanguage(),
        languageCode: app.getLanguage()
      }
    });
  },

  /**
   * @method render
   * @returns {DashboardListsComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method handleClickVocablistSections
   * @param {Event} event
   */
  handleClickVocablistSections: function(event) {
    event.preventDefault();
    var $row = $(event.target).closest('.row');
    var attributes = {id: $row.data('list-id')};
    this.vocablist = new Vocablist(attributes);
    this.listenToOnce(this.vocablist, 'state:standby', this.render);
    this.vocablist.fetch();
  },

  /**
   * @method handleClickShowLists
   * @param {Event} event
   */
  handleClickShowLists: function(event) {
    event.preventDefault();
    this.vocablist = null;
    this.listenToOnce(this.vocablist, 'state:standby', this.render);
    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'adding',
        include_percent_done: 'true',
        lang: app.getLanguage()
      }
    });
  }

});

module.exports = DashboardListsComponent;
