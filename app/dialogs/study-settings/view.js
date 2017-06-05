const BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class StudySettingsDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-close': 'handleClickClose',
    'click #button-save': 'handleClickSave',
    'click .part-checkbox': 'handleClickVocabPart'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {StudySettingsDialog}
   */
  render: function() {
    this.renderTemplate();

    this.volumeSlider = this.$('#field-audio-volume').bootstrapSlider({});

    return this;
  },

  /**
   * @method getSelectedParts
   * @returns {Array}
   */
  getSelectedParts: function() {
    return this.$('#field-parts :checked').map(function() {
      return $(this).val();
    });
  },

  /**
   * @method getSelectedStyles
   * @returns {Array}
   */
  getSelectedStyles: function() {
    return this.$('#field-styles :checked').map(function() {
      return $(this).val();
    });
  },

  /**
   * @method getSettings
   * @returns {Object}
   */
  getSettings: function() {
    const settings = {
      squigs: this.$('#field-squigs input').is(':checked')
    };

    if (app.isChinese()) {
      settings.filteredChineseParts = this.getSelectedParts();
      settings.filteredChineseStyles = this.getSelectedStyles();
    }

    if (app.isJapanese()) {
      settings.filteredJapaneseParts = this.getSelectedParts();
      settings.filteredJapaneseStyles = [];
    }

    if (this.$('#field-audio input').is(':checked')) {
      settings.volume = this.volumeSlider.bootstrapSlider('getValue');
    } else {
      settings.volume = 0;
    }

    return settings;
  },

  /**
   * @method handleClickClose
   * @param {Event} event
   */
  handleClickClose: function(event) {
    event.preventDefault();

    this.trigger('close');
    this.close();
  },

  /**
   * @method handleClickSave
   * @param {Event} event
   */
  handleClickSave: function(event) {
    event.preventDefault();

    this.trigger('save', this.getSettings());
    this.$(':input').attr('disabled', true);
  },

  /**
   * Checks to prevent unchecking all study parts. User has to study something!
   * @param {jQuery.Event} event the click event on the checkbox
   */
  handleClickVocabPart: function(event) {
    const checked = this.$('.part-checkbox:checked');

    if (checked.length === 0) {
      $(event.target).prop('checked', true);
    }
  }
});
