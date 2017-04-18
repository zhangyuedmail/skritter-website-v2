var BootstrapDialog = require('base/bootstrap-dialog');

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
    return this;
  },
  /**
   * @method getSelectedParts
   * @returns {Array}
   */
  getSelectedParts: function() {
    var parts = [];
    this.$('#field-parts :checked').each(function() {
      parts.push($(this).val());
    });

    return parts;
  },

  /**
   * @method getSettings
   * @returns {Object}
   */
  getSettings: function() {
    if (app.isJapanese()) {
      return {
        //dailyItemAddingLimit: this.$('#field-daily-item-adding-limit input').val(),
        addFrequency: this.$('#field-auto-adding').is(':checked') ? 80 : 0,
        filteredJapaneseParts: this.getSelectedParts(),
        hideDefinition: this.$('#field-hide-definition input').is(':checked'),
        hideReading: this.$('#field-hide-reading input').is(':checked'),
        readingJapanese: this.$('#field-romaji input').is(':checked') ? 'romaji' : 'kana',
        squigs: this.$('#field-squigs input').is(':checked'),
        teachingMode: this.$('#field-teaching-mode input').is(':checked'),
        volume: this.$('#field-audio input').is(':checked') ? 1 : 0
      };
    } else {
      return {
        //dailyItemAddingLimit: this.$('#field-daily-item-adding-limit input').val(),
        addFrequency: this.$('#field-auto-adding').is(':checked') ? 80 : 0,
        disablePinyinReadingPromptInput: this.$('#field-pinyin-input').is(':checked'),
        filteredChineseParts: this.getSelectedParts(),
        hideDefinition: this.$('#field-hide-definition input').is(':checked'),
        hideReading: this.$('#field-hide-reading input').is(':checked'),
        readingChinese: this.$('#field-bopomofo input').is(':checked') ? 'zhuyin' : 'pinyin',
        squigs: this.$('#field-squigs input').is(':checked'),
        teachingMode: this.$('#field-teaching-mode input').is(':checked'),
        volume: this.$('#field-audio input').is(':checked') ? 1 : 0
      };
    }
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
    var checked = this.$('.part-checkbox:checked');

    if (checked.length === 0) {
      $(event.target).prop('checked', true);
    }
  }
});
