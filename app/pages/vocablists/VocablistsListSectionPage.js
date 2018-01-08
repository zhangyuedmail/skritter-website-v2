const GelatoPage = require('gelato/page');
const EditorRows = require('components/vocablists/VocablistsRowEditorComponent');
const Vocablist = require('models/VocablistModel');
const VocablistSection = require('models/VocablistSectionModel');
const ConfirmGenericDialog = require('dialogs1/confirm-generic/view');

/**
 * @class VocablistsListSectionPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'keydown #add-input': 'handleKeydownAddInput',
    'click #back-link': 'handleClickBackLink',
    'click #discard-changes': 'handleClickDiscardChanges',
    'click #edit-section': 'handleClickEditSection',
    'click #save-changes': 'handleClickSaveChanges',
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
  template: require('./VocablistsListSection'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    this.editing = options.editMode || false;
    this.fetching = false;

    this.vocablist = options.vocabList || new Vocablist({id: options.vocablistId});

    let sectionData = {
      vocablistId: options.vocablistId,
      id: options.sectionId,
    };

    if (options.vocabListSection) {
      sectionData = _.extend(options.vocabListSection, {vocablistId: this.vocablist.id});
    }

    this.vocablistSection = new VocablistSection(sectionData);

    this.editor = new EditorRows({
      vocablist: this.vocablist,
      vocablistSection: this.vocablistSection,
      editing: this.editing,
    });

    this.fetchListData();
  },

  /**
   * @method render
   * @returns {VocablistsListSectionPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsListSection.jade');
    }

    this.renderTemplate();
    this.editor.setElement('#editor-container').render();

    if (this.vocablist.has('name')) {
      document.title = this.vocablist.get('name') + ' - Vocablist - Skritter';
    }

    if (!app.isMobile() && this.editor.editing) {
      this.$('#add-input').focus();
    }

    return this;
  },

  /**
   * Fetches all the necessary list data to show the view to the user
   * @method fetchListData
   */
  fetchListData: function () {
    this.fetching = true;
    async.series([
      (callback) => {
        if (this.vocablist.isFetched) {
          callback();
          return;
        }

        this.vocablist.fetch({
          error: function (error) {
            callback(error);
          },
          success: function () {
            callback();
          },
        });
      },
      (callback) => {
        if (this.vocablistSection.get('name')) {
          callback();
          return;
        }
        this.vocablistSection.fetch({
          error: function (error) {
            callback(error);
          },
          success: function () {
            callback();
          },
        });
      },
      (callback) => {
        this.editor.loadRows({
          error: function (error) {
            callback(error);
          },
          success: function () {
            callback();
          },
        });
      },
    ], (error) => {
      const sections = this.vocablist.get('sections');
      const sectionIndex = _.findIndex(sections, {id: this.vocablistSection.id});

      if (sectionIndex > 0) {
        this.sectionPrevious = sections[sectionIndex - 1];
      }

      if (sections.length > sectionIndex) {
        this.sectionNext = sections[sectionIndex + 1];
      }

      this.listDataLoaded(error);
    });
  },

  /**
   * Finalizes the view after data has been fetched. Checks for errors, hooks up events,
   * and finally re-renders the page.
   * @param {Object} [error]
   */
  listDataLoaded: function (error) {
    this.fetching = false;

    if (error) {
      app.notifyUser({
        message: app.locale('There was a problem loading the section. Please try again.'),
      });
    }

    if (!this.vocablistSection.get('rows').length) {
      this.editor.editing = true;
    }

    this.listenTo(this.vocablist, 'state:standby', this.handleVocablistState);
    this.listenTo(this.vocablistSection, 'state:standby', this.handleVocablistSectionState);

    this.render();

    // disabled for now until stable
    // this.editor.loadAndRenderVocabProgress();
  },

  /**
   * Handles the user clicking on the back link. Checks if the view is currently being edited,
   * and if so, shows a confirmation popup before navigating away.
   * @method handleClickBackLink
   * @param {Event} event
   */
  handleClickBackLink: function (event) {
    const self = this;

    if (this.editor.editing) {
      event.preventDefault();
      this.dialog = new ConfirmGenericDialog({
        body: 'You have some unsaved changes that will be lost if you continue.',
        buttonConfirm: 'Continue',
        title: 'Unsaved changes detected',
      });
      this.dialog.once(
        'confirm',
        function () {
          app.router.navigate('vocablists/view/' + self.vocablist.id, {trigger: true});
          self.dialog.close();
        }
      );
      this.dialog.open();
    } else {
      app.router.navigate('vocablists/view/' + self.vocablist.id, {trigger: true});
    }
  },

  /**
   * Handles when the user clicks the cancel button. If there are rows,
   * shows a confirmation popup.
   * @method handleClickDiscardChanges
   * @param {Event} event
   */
  handleClickDiscardChanges: function (event) {
    const self = this;
    event.preventDefault();

    const rows = this.editor.getRows();

    if (!rows.length) {
      this.editor.editing = false;
      this.editor.discardChanges();
      this.render();
      return;
    }

    this.dialog = new ConfirmGenericDialog({
      body: 'This will discard all unsaved changes this current list section.',
      buttonConfirm: 'Discard',
      title: 'Discard all changes?',
    });

    this.dialog.once(
      'confirm',
      function () {
        self.editor.editing = false;
        self.editor.discardChanges();
        self.dialog.close();
      }
    );
    this.dialog.once(
      'hidden',
      function () {
        self.render();
      }
    );
    this.dialog.open();
  },

  /**
   * @method handleClickEditSection
   * @param {Event} event
   */
  handleClickEditSection: function (event) {
    event.preventDefault();
    this.editor.editing = !this.editor.editing;
    this.render();
  },

  /**
   * Handles when the user clicks on the save button.
   * Gets the rows and saves them to the server. Disables input while doing so.
   * @method handleClickSaveChanges
   * @param {Event} event
   */
  handleClickSaveChanges: function (event) {
    event.preventDefault();
    const self = this;

    const rows = this.editor.getRows();
    this.editor.rows = rows;

    if (!rows.length) {
      this.editor.editing = false;
      this.render();
      return;
    }

    this.vocablistSection.set('name', this.$('#section-name').val());
    this.vocablistSection.set('rows', this.editor.rows);

    this.toggleInputs();
    this.vocablistSection.save(null, {
      success: function () {
        self.editor.editing = false;
        self.render();
        app.notifyUser({
          message: self.vocablistSection.get('name') + ' ' + app.locale('pages.vocabLists.successSavingSection'),
          type: 'pastel-success',
        });
      },
      error: function () {
        self.toggleInputs(true);
        app.notifyUser({
          message: app.locale('pages.vocabLists.errorSavingSection'),
        });
      },
    });

    // remove all results button
    _.forEach(
      this.editor.rows,
      function (row) {
        delete row.results;
      }
    );
  },

  /**
   * @method handleKeydownAddInput
   * @param {Event} event
   */
  handleKeydownAddInput: function (event) {
    this.$('#input-message .value').empty();

    if (event.keyCode === 13) {
      // split input based on spaces
      let $input = $(event.target);
      let rows = _.trim($input.val()).split(/\s/);

      // limit adding to section
      if ((this.editor.rows.length + rows.length) > 200) {
        event.preventDefault();
        this.$('#input-message .value').text('The max words per section is 200.');
        return;
      }

      this.$('#input-message .value').empty();
      this.editor.addRows(rows);
      window.scrollTo(0, document.body.scrollHeight);
      $input.val('');
      $input.focus();
    }
  },

  /**
   * @method handleVocablistState
   */
  handleVocablistState: function () {
    this.render();
  },

  /**
   * @method handleVocablistState
   */
  handleVocablistSectionState: function () {
    this.render();
  },

  /**
   * @method remove
   * @returns {VocablistsListSectionPage}
   */
  remove: function () {
    this.editor.remove();
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Toggles the enabled/disabled state of the inputs and buttons on the editor
   * @param {boolean} [enabled] whether to enable the inputs
   */
  toggleInputs: function (enabled) {
    this.$('button').prop('disabled', !enabled);
    this.$('#section-name').prop('disabled', !enabled);
    this.$('#add-input').prop('disabled', !enabled);

    // always leave the cancel button enabled to make the user feel good
    this.$('#discard-changes').prop('disabled', false);
  },
});
