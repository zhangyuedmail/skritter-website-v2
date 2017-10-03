const GelatoComponent = require('gelato/component');
// const Vocablists = require('collections/VocablistCollection');
const VocablistSettings = require('dialogs/vocablist-settings/view');
const VocablistRemoveDialog = require('dialogs/vocablist-remove/view');

/**
 * @class VocablistsReviewingTableComponent
 * @extends {GelatoComponent}
 */
const VocablistsReviewingTableComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .restart-adding-link': 'handleClickRestartAddingLink',
    'click .list-settings-span': 'handleClickListSettingsSpan',
    'click .remove-list-span': 'handleClickRemoveListSpan',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsReviewingTable.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    this.vocablists = options.vocablists;
    this.listenTo(this.vocablists, 'state', this.render);
  },

  /**
   * @method render
   * @returns {VocablistsReviewingTableComponent}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsReviewingTable.jade');
    }

    this.renderTemplate();

    return this;
  },

  /**
   * @method handleClickRestartAddingLink
   * @param {Event} event
   */
  handleClickRestartAddingLink: function (event) {
    let listID = $(event.target).closest('.row').data('list-id');
    let list = this.vocablists.get(listID.toString());
    list.save({'studyingMode': 'adding'}, {patch: true});
    this.render();
  },

  /**
   * @method handleClickListSettingsSpan
   * @param {Event} event
   */
  handleClickListSettingsSpan: function (event) {
    let listID = $(event.target).closest('.row').data('list-id');
    let list = this.vocablists.get(listID.toString());
    this.dialog = new VocablistSettings({vocablist: list});
    this.dialog.render().open();
  },

  /**
   * @method handleClickRemoveListSpan
   * @param {Event} event
   */
  handleClickRemoveListSpan: function (event) {
    let listID = $(event.target).closest('.row').data('list-id');
    let list = this.vocablists.get(listID.toString());
    this.dialog = new VocablistRemoveDialog({vocablist: list});
    this.dialog.render().open();
  },

});

module.exports = VocablistsReviewingTableComponent;
