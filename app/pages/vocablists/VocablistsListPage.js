let GelatoPage = require('gelato/page');
let EditorSections = require('components/vocablists/VocablistsSectionEditorComponent');
let Sidebar = require('components/vocablists/VocablistsListSidebarComponent');
let Vocablist = require('models/VocablistModel');
let VocablistSection = require('models/VocablistSectionModel');

let ConfirmDialog = require('dialogs/confirm/view');
let PublishDialog = require('dialogs1/publish-vocablist/content/view');
let ViewDialog = require('dialogs1/view-dialog/view');

/**
 * @class VocablistsListPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #add-to-queue': 'handleClickAddToQueue',
    'click #add-section': 'handleClickAddSection',
    'click #discard-changes': 'handleClickDiscardChanges',
    'click #edit-list': 'handleClickEditList',
    'click #save-changes': 'handleClickSaveChanges',

    'click #copy-link': 'handleClickCopyLink',
    'click #delete-link': 'handleClickDeleteLink',
    'click #publish-link': 'handleClickPublishLink',
  },

  /**
   * @property title
   * @type {String}
   */
  title: 'Vocablist - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsList'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    this.editing = false;
    this.vocablist = new Vocablist({id: options.vocablistId});
    this.vocablistSection = new VocablistSection({vocablistId: options.vocablistId});
    this.editor = new EditorSections({vocablist: this.vocablist, vocablistSection: this.vocablistSection});
    this.sidebar = new Sidebar({vocablist: this.vocablist});

    this._views['publishDialog'] = new ViewDialog({
      content: PublishDialog,
    });

    this.fetchList();
  },

  /**
   * @method render
   * @returns {VocablistsListPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsList.jade');
    }

    this.renderTemplate();
    this.editor.setElement('#editor-container').render();
    this.sidebar.setElement('#sidebar-container').render();

    if (this.vocablist.has('name')) {
      document.title = this.vocablist.get('name') + ' - Vocablist - Skritter';
    }

    return this;
  },

  /**
   * @method remove
   * @returns {VocablistsListPage}
   */
  remove: function () {
    this.editor.remove();
    this.sidebar.remove();

    return GelatoPage.prototype.remove.call(this);
  },


  /**
   * Fetches the vocablist and sections.
   * Adds event listeners and re-renders the page when finished.
   * @method fetchList
   */
  fetchList: function () {
    const self = this;

    async.series([
      function (callback) {
        self.vocablist.fetch({
          data: {
            include_user_names: 'true',
            includeSectionCompletion: 'true',
          },
          error: function () {
            callback();
          },
          success: function () {
            callback();
          },
        });
      },
      _.bind(self.fetchVocablistSections, this),
    ], function (error) {
      self.listenTo(self.vocablist, 'state:standby', self.handleVocablistState);
      self.render();
    });
  },

  /**
   * Fetches the sections for a vocablist
   * @param {Function} callback called when the sections are fetched
   */
  fetchVocablistSections: function (callback) {
    if (this.vocablist.get('sections').length === 1) {
      this.vocablistSection.set('id', this.vocablist.get('sections')[0].id);
      this.vocablistSection.fetch({
        data: {
          include_user_names: 'true',
          includeSectionCompletion: 'true',
        },
        error: function (error) {
          callback(error);
        },
        success: function () {
          callback();
        },
      });
    } else {
      callback();
    }
  },

  /**
   * @method handleClickAddToQueue
   * @param {Event} event
   */
  handleClickAddToQueue: function (event) {
    event.preventDefault();
    if (this.vocablist.get('studyingMode') === 'not studying') {
      this.vocablist.save({'studyingMode': 'adding'}, {patch: true});
      this.render();
    }
  },

  /**
   * @method handleClickAddSection
   * @param {Event} event
   */
  handleClickAddSection: function (event) {
    event.preventDefault();
    this.editor.addSection();
  },

  /**
   * @method handleClickCopyLink
   * @param {Event} event
   */
  handleClickCopyLink: function (event) {
    const confirmDialog = new ConfirmDialog({
      title: 'Confirm Copy',
      body: 'Are you sure you want to make a copy of this list?',
      okText: 'Yes - Copy!',
      onConfirm: 'show-spinner',
    });

    event.preventDefault();

    this.listenTo(confirmDialog, 'confirm', () => {
      const copyUrl = app.getApiUrl() + _.result(this.vocablist, 'url') + '/copy';

      $.ajax({
        url: copyUrl,
        method: 'POST',
        headers: app.user.headers(),
        success: (response) => {
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
  handleClickDeleteLink: function (event) {
    event.preventDefault();
    let confirmDialog = new ConfirmDialog({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this list?',
      okText: 'Yes - Delete!',
      onConfirm: 'show-spinner',
    });
    this.listenTo(confirmDialog, 'confirm', function () {
      this.vocablist.save({disabled: true, studyingMode: 'not studying'}, {patch: true});
      this.listenToOnce(this.vocablist, 'state', function () {
        app.router.navigate('/vocablists/my-lists', {trigger: true});
        confirmDialog.close();
      });
    });
    confirmDialog.render().open();
  },

  /**
   * @method handleClickDiscardChanges
   * @param {Event} event
   */
  handleClickDiscardChanges: function (event) {
    event.preventDefault();
    this.editing = false;
    this.editor.editing = false;
    this.render();
  },

  /**
   * @method handleClickEditList
   * @param {Event} event
   */
  handleClickEditList: function (event) {
    event.preventDefault();
    this.editing = true;
    this.editor.editing = true;
    this.render();
  },

  /**
   * Handles the functionality for when the user pushes a button to publish the vocablist.
   * @method handleClickPublishLink
   * @param {Event} event
   */
  handleClickPublishLink: function (event) {
    this._views['publishDialog'].open();
  },

  /**
   * @method handleClickSaveChanges
   * @param {Event} event
   */
  handleClickSaveChanges: function (event) {
    event.preventDefault();
    this.editing = false;
    this.editor.editing = false;
    this.updateVocablist();
    this.editor.updateVocablist();
    if (this.vocablist.isFinished()) {
      this.vocablist.set('studyingMode', 'adding');
    }
    this.vocablist.save(null, {patch: true});
    this.render();
  },

  /**
   * @method handleVocablistState
   */
  handleVocablistState: function () {
    this.sidebar.render();
    this.render();
  },

  /**
   * @method updateVocablist
   */
  updateVocablist: function () {
    this.vocablist.set({
      description: this.$('.list-description').val(),
      name: this.$('.list-name').val(),
    });
  },
});
