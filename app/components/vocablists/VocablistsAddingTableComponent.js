const GelatoComponent = require('gelato/component');
const VocablistSettings = require('dialogs/vocablist-settings/view');
const VocablistRemoveDialog = require('dialogs/vocablist-remove/view');

/**
 * @class VocablistsAddingTableComponent
 * @extends {GelatoComponent}
 */
const VocablistsAddingTableComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .stop-adding-link': 'handleClickStopAddingLink',
    'click .list-settings-span': 'handleClickListSettingsSpan',
    'click .remove-list-span': 'handleClickRemoveListSpan'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsAddingTable.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.vocablists = options.vocablists;
    this.listenTo(this.vocablists, 'state', this.render);
  },

  /**
   * @method render
   * @returns {VocablistsAddingTableComponent}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsAddingTable.jade');
    }

    this.renderTemplate();

    return this;
  },

  /**
   * @method handleClickStopAddingLink
   * @param {Event} event
   */
  handleClickStopAddingLink: function(event) {
    event.preventDefault();

    const listID = $(event.target).closest('.row').data('list-id');
    const list = this.vocablists.get(listID.toString());

    list.save({'studyingMode': 'reviewing'}, {patch: true});
    this.render();
  },

  /**
   * @method handleClickListSettingsSpan
   * @param {Event} event
   */
  handleClickListSettingsSpan: function(event) {
    event.preventDefault();

    const listID = $(event.target).closest('.row').data('list-id');
    const list = this.vocablists.get(listID.toString());

    this.dialog = new VocablistSettings({vocablist: list});
    this.dialog.render().open();
  },

  /**
   * @method handleClickRemoveListSpan
   * @param {Event} event
   */
  handleClickRemoveListSpan: function(event) {
    event.preventDefault();

    const listID = $(event.target).closest('.row').data('list-id');
    const list = this.vocablists.get(listID.toString());

    this.dialog = new VocablistRemoveDialog({vocablist: list});
    this.dialog.render().open();
  }

});

module.exports = VocablistsAddingTableComponent;
