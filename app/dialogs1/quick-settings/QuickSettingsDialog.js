const GelatoDialog = require('gelato/dialog');
const ListSelect = require('components/common/ListSelectComponent');

/**
 * @class QuickSettingsDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-close': 'handleClickClose',
    'click #button-save': 'handleClickSave',
    'click .part-checkbox': 'handleClickVocabPart',
    'click #more-settings-btn': 'handleClickMoreSettings'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./QuickSettingsDialog.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this._views['lists'] = new ListSelect();
  },

  /**
   * @method render
   * @returns {QuickSettingsDialog}
   */
  render: function() {
    this.renderTemplate();

    this._views['lists'].setElement('#list-select-container').render();

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
    }).get();
  },

  /**
   * @method getSelectedStyles
   * @returns {Array}
   */
  getSelectedStyles: function() {
    if (app.user.isAddingStyle('simp') && app.user.isAddingStyle('trad')) {
      return ['both'].concat(this.$('#field-styles :checked').map(function() {
        return $(this).val();
      }).get());
    }

    return app.user.getStudyStyles();
  },

  /**
   * @method getSettings
   * @returns {Object}
   */
  getSettings: function() {
    const settings = {
      audioEnabled: this.$('#field-audio input').is(':checked'),
      squigs: this.$('#field-squigs input').is(':checked'),
      volume: this.volumeSlider.bootstrapSlider('getValue')
    };

    if (app.isChinese()) {
      settings.filteredChineseLists = this._views['lists'].getSelected();
      settings.filteredChineseParts = this.getSelectedParts();
      settings.filteredChineseStyles = this.getSelectedStyles();
    }

    if (app.isJapanese()) {
      settings.filteredJapaneseLists = this._views['lists'].getSelected();
      settings.filteredJapaneseParts = this.getSelectedParts();
      settings.filteredJapaneseStyles = [];
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
    $('body').removeClass('modal-open');
  },

  handleClickMoreSettings: function(event) {
    this.handleClickClose(event);

    app.router.navigate('account/settings/study', {trigger: true});
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
