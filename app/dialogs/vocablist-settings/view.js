let BootstrapDialog = require('base/bootstrap-dialog');

/**
 * Displays study settings that a user can customize for a VocabList.
 * @class VocablistSettingsDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * Initializes a new settings list. Fetches the vocablist and rerenders
   * the content of the view after it's been fetched.
   * @method initialize
   * @param {Object} options
   */
  initialize: function (options) {
    this.vocablist = options.vocablist;
    if (!this.vocablist) {
      throw new Error('VocablistSettingsDialog requires a vocablist passed in!');
    }
    if (!this.vocablist.get('sections')) {
      this.vocablist.fetch({
        data: {
          include_user_names: 'true',
          includeSectionCompletion: 'true',
        },
      });

      // hack until state event and property works
      this.listenTo(this.vocablist, 'sync', function () {
        this.vocablist.state = 'standby';
        this.renderContent();
      });
    }
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('dialogs/vocablist-settings/template'),
  /**
   * @method render
   * @returns {VocablistSettingsDialog}
   */
  render: function () {
    this.renderTemplate();
    return this;
  },
  /**
   * @method renderContent
   */
  renderContent: function () {
    let rendering = $(this.template(this.getContext()));
    this.$('.modal-content').replaceWith(rendering.find('.modal-content'));
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #close-btn': 'handleClickCloseButton',
    'click #save-btn': 'handleClickSaveButton',
  },
  /**
   * @method handleClickCloseButton
   * @param {Event} event
   */
  handleClickCloseButton: function (event) {
    this.close();
  },
  /**
   * @method handleClickSaveButton
   */
  handleClickSaveButton: function () {
    let sections = this.vocablist.get('sections');
    let getVals = function (el) {
      return $(el).val();
    };

    let attributes = {
      id: this.vocablist.id,
      studyingMode: this.$el.find('input[name="studyingMode"]:checked').val(),
      partsStudying: $.map(this.$el.find('input[name="partsStudying"]:checked'), getVals),
      limitSentenceParts: this.$el.find('input[name="limitSentenceParts"]').is(':checked'),
    };

    let studyAllListWritingsEl = this.$el.find('input[name="studyAllListWritings"]');
    if (studyAllListWritingsEl.length) {
      attributes.studyAllListWritings = studyAllListWritingsEl.is(':checked');
    }

    let currentSectionSelect = this.$el.find('select[name="currentSection"]');
    if (currentSectionSelect.length) {
      attributes.currentSection = currentSectionSelect.val();
    }

    let skipSectionsInputs = this.$el.find('input[name="sectionsSkipping"]');
    if (skipSectionsInputs.length) {
      let skippingInputs = skipSectionsInputs.filter(':not(:checked)');
      attributes.sectionsSkipping = $.map(skippingInputs, getVals);
    }

    let autoSectionMovementEl = this.$el.find('input[name="autoSectionMovement"]');
    if (autoSectionMovementEl.length) {
      attributes.autoSectionMovement = autoSectionMovementEl.is(':not(:checked)');
    }

    if (sections && sections.length) {
      attributes.currentIndex = 0;
    }

    this.vocablist.set(attributes).save(attributes, {
      patch: true,
      url: app.getApiUrl() + this.vocablist.url() + '?includeSectionCompletion=true',
    });

    this.close();
  },
});
