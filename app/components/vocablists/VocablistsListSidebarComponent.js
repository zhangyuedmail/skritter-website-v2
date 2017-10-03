const GelatoComponent = require('gelato/component');

let AddVocabDialog = require('dialogs1/add-vocab/view');
let ConfirmDialog = require('dialogs/confirm/view');
let ExportVocablistDialog = require('dialogs1/export-vocablist/view');
let HistoryVocablistDialog = require('dialogs1/vocablist-history/view');
let PublishDialog = require('dialogs1/publish-vocablist/content/view');
let VocablistSettingsDialog = require('dialogs/vocablist-settings/view');
let ViewDialog = require('dialogs1/view-dialog/view');

/**
 * @class VocablistsListSidebarComponent
 * @extends {GelatoComponent}
 */
const VocablistsListSidebarComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'change #image-upload-input': 'handleChangeImageUploadInput',
    'click #add-to-queue-sidebar': 'handleClickAddToQueue',
    'click #copy-link-sidebar': 'handleClickCopyLink',
    'click #delete-link-sidebar': 'handleClickDeleteLink',
    'click #export-link-sidebar': 'handleClickExportLink',
    'click #history-link-sidebar': 'handleClickHistoryLink',
    'click #publish-link-sidebar': 'handleClickPublishLink',
    'click #quick-add-link-sidebar': 'handleClickQuickAddLink',
    'click #study-settings-link-sidebar': 'handleClickStudySettingsLink',
    'click #image-upload-link-sidebar': 'handleClickImageUploadLink',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsListSidebar'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.vocablist = options.vocablist;

    this._views['publishDialog'] = new ViewDialog({
      content: PublishDialog,
    });

    this._views['historyDialog'] = new ViewDialog({
      content: HistoryVocablistDialog,
      contentOptions: {
        vocablist: this.vocablist,
      },
    });

    this.listenTo(this._views['publishDialog'], 'publish', this.publishList);
  },

  /**
   * @method render
   * @returns {VocablistsListSidebarComponent}
   */
  render: function() {
    this.renderTemplate();

    this._views['publishDialog'].render();

    return this;
  },

  /**
   * @method handleChangeImageUploadInput
   * @param {Event} event
   */
  handleChangeImageUploadInput: function(event) {
    let file = event.target.files[0];
    let data = new FormData().append('image', file);
    this.$('#list-img-wrapper .fa-spinner').removeClass('hide');
    this.$('#list-img').remove();
    this.$('#missing-image-stub').removeClass('hide');
    let imageUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/image';
    $.ajax({
      url: imageUrl,
      method: 'POST',
      headers: app.user.headers(),
      data: data,
      processData: false,
      contentType: false,
      success: function() {
        document.location.reload();
      },
    });
  },

  /**
   * @method handleClickAddToQueue
   * @param {Event} event
   */
  handleClickAddToQueue: function(event) {
    event.preventDefault();
    if (this.vocablist.get('studyingMode') === 'not studying') {
      this.vocablist.save({'studyingMode': 'adding'}, {patch: true});
      this.render();
    }
  },

  /**
   * @method handleClickCopyLink
   * @param {Event} event
   */
  handleClickCopyLink: function(event) {
    const confirmDialog = new ConfirmDialog({
      title: 'Confirm Copy',
      body: 'Are you sure you want to make a copy of this list?',
      okText: 'Yes - Copy!',
      onConfirm: 'show-spinner',
    });

    event.preventDefault();

    this.listenTo(confirmDialog, 'confirm', function() {
      const copyUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/copy';

      $.ajax({
        url: copyUrl,
        method: 'POST',
        headers: app.user.headers(),
        success: function(response) {
          app.router.navigate('/vocablists/view/' + response.VocabList.id, {trigger: true});
          confirmDialog.close();
        },
      });
    });

    confirmDialog.render().open();
  },

  /**
   * @method handleClickDeleteLink
   * @param {Event} event
   */
  handleClickDeleteLink: function(event) {
    event.preventDefault();
    let confirmDialog = new ConfirmDialog({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this list?',
      okText: 'Yes - Delete!',
      onConfirm: 'show-spinner',
    });
    this.listenTo(confirmDialog, 'confirm', function() {
      this.vocablist.save({disabled: true, studyingMode: 'not studying'}, {patch: true});
      this.listenToOnce(this.vocablist, 'state', function() {
        app.router.navigate('/vocablists/my-lists', {trigger: true});
        confirmDialog.close();
      });
    });
    confirmDialog.render().open();
  },

  /**
   * @method handleClickExportLink
   * @param {Event} event
   */
  handleClickExportLink: function(event) {
    event.preventDefault();
    new ExportVocablistDialog({id: this.vocablist.id}).open();
  },

  handleClickHistoryLink: function(event) {
    event.preventDefault();
    this._views['historyDialog'].open();
  },

  /**
   * @method handleClickImageUploadLink
   * @param {Event} event
   */
  handleClickImageUploadLink: function(event) {
    event.preventDefault();
    this.$('#image-upload-input').trigger('click');
  },

  /**
   * Handles the functionality for when the user pushes a button to publish the vocablist.
   * @method handleClickPublishLink
   * @param {Event} event
   */
  handleClickPublishLink: function(event) {
    this._views['publishDialog'].open();
  },

  handleClickQuickAddLink: function(event) {
    event.preventDefault();
    new AddVocabDialog().open();
  },

  /**
   * Calls the steps necessary to publish a vocablist.
   * @param {Object} formData options from the popup about the list to publish
   * @param {Boolean} formData.isTextbook whether the list is for a textbook
   */
  publishList: function(formData) {
    this.vocablist.set('isTextbook', formData.isTextbook);
    this.vocablist.publish(function(success) {
      document.location.reload();
    });
  },

  /**
   * @method handleClickStudySettingsLink
   * @param {Event} event
   */
  handleClickStudySettingsLink: function(event) {
    event.preventDefault();
    this.dialog = new VocablistSettingsDialog({vocablist: this.vocablist});
    this.dialog.render().open();
  },

});

module.exports = VocablistsListSidebarComponent;
