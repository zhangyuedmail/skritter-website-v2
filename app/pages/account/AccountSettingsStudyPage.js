const GelatoPage = require('gelato/page');
const AccountSidebar = require('components/account/AccountSidebarComponent');
const ResetVocablistPositionDialog = require('dialogs1/reset-vocablist-position/view');

/**
 * @class AccountSettingsStudyPage
 * @extends {GelatoPage}
 */
const AccountSettingsStudyPage = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    // 'change select': 'handleChangeSelect',
    // 'change input[type="checkbox"]': 'handleChangeCheckbox',
    // 'change #field-target-language': 'handleChangeTargetLanguage',
    'change #field-goal-type': 'handleChangeGoalType',
    'click #button-save': 'handleClickButtonSave',
  },

  /**
   * @property title
   * @type {String}
   */
  title: 'Study Settings - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./AccountSettingsStudy'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    options = options || {};
    this.jumpToSetting = options.jumpToSetting;

    this.sidebar = new AccountSidebar();
    this.sourceLanguages = require('data/source-languages');
    this.listenTo(app.user, 'state', this.render);
    app.user.fetch();
  },

  /**
   * @method render
   * @returns {AccountSettingsStudyPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileAccountSettingsStudy.jade');
    }

    this.renderTemplate();
    this.sidebar.setElement('#sidebar-container').render();

    if (this.jumpToSetting) {
      this.$('#' + this.jumpToSetting).addClass('highlighted');
      _.defer(() => {
        this.scrollTo('#' + this.jumpToSetting);
      });
    }
    return this;
  },

  /**
   * Displays an error message to the user.
   * @param {String} msg the message to display to the user
   */
  displayErrorMessage: function (msg) {
    this.$('#error-alert').text(msg).removeClass('hidden');
  },

  /**
   * Gets the daily vocab auto-add limit for a user
   * @returns {Number}
   */
  getAddLimit () {
    const maxVocabsMap = {0.6: 7, 0.7: 10, 0.9: 15}; // 12};
    const addFreq = app.user.get('addFrequency') / 100;

    return app.user.get('dailyAddLimit') || maxVocabsMap[addFreq];
  },

  /**
   * @method getSelectedParts
   * @returns {Array}
   */
  getSelectedParts: function () {
    let parts = [];
    this.$('#field-parts :checked').each(function () {
      parts.push($(this).val());
    });
    return parts;
  },

  /**
   * Responds to the user changing a checkbox input's value
   * @param {jQuery.Event} event
   */
  handleChangeCheckbox: function (event) {
    this.handleClickButtonSave(event);
  },

  handleChangeGoalType: function (event) {
    const goalType = $(event.target).val();
    const goalValue = app.user.get('goalValues')[app.getLanguage()][goalType];

    event.preventDefault();

    this.$('#field-goal-value').val(goalValue);
  },

  /**
   * Responds to the user changing a select input's value
   * @param {jQuery.Event} event
   */
  handleChangeSelect: function (event) {
    this.handleClickButtonSave(event);
  },

  /**
   * @method handleChangeTargetLanguage
   * @param {Event} event
   */
  handleChangeTargetLanguage: function (event) {
    event.preventDefault();
    app.user.set('targetLang', this.$('#field-target-language').val());
    this.render();
  },

  /**
   * @method handleClickButtonSave
   * @param {Event} event
   */
  handleClickButtonSave: function (event) {
    event.preventDefault();

    let zhStudyStyleChanged;

    app.user.set({
      addFrequency: parseInt(this.$('#field-add-frequency').val(), 10) || app.user.get('addFrequency'),
      autoAddComponentCharacters: this.$('#field-add-contained').is(':checked'),
      autoAdvancePrompts: this.$('#field-auto-advance').is(':checked') ? 1.0 : 0,
      dailyAddLimit: this.$('#field-add-limit').val(),
      disableGradingColor: this.$('#field-disable-color').is(':checked'),
      goalEnabled: this.$('#field-goal-mode').is(':checked'),
      hideDefinition: this.$('#field-hide-definition').is(':checked'),
      hideReading: this.$('#field-hide-reading').is(':checked'),
      retentionIndex: parseInt(this.$('#field-retention-index').val(), 10),
      showHeisig: this.$('#field-heisig').is(':checked'),
      sourceLang: this.$('#field-source-language').val(),
      squigs: this.$('#field-squigs').is(':checked'),
      targetLang: this.$('#field-target-language').val() || app.getLanguage(),
      teachingMode: this.$('#field-teaching-mode').is(':checked'),
    });

    if (app.isChinese()) {
      app.user.set({
        addSimplified: this.$('#field-styles [value="simp"]').is(':checked'),
        addTraditional: this.$('#field-styles [value="trad"]').is(':checked'),
        chineseStudyParts: this.getSelectedParts(),
        disablePinyinReadingPromptInput: this.$('#field-pinyin-input').is(':checked'),
        readingChinese: this.$('#field-bopomofo').is(':checked') ? 'zhuyin' : 'pinyin',
      });
    }

    if (app.isJapanese()) {
      app.user.set({
        japaneseStudyParts: this.getSelectedParts(),
        readingJapanese: this.$('#field-romaji').is(':checked') ? 'romaji' : 'kana',
        studyKana: this.$('#field-study-kana').is(':checked'),
        studyRareWritings: this.$('#field-study-rare-writings').is(':checked'),
        studyAllListWritings: this.$('#field-study-all-list-writings').is(':checked'),
      });
    }

    zhStudyStyleChanged = (app.isChinese() && app.user.hasChanged('addSimplified') || app.user.hasChanged('addTraditional'));

    app.user.setGoal(this.$('#field-goal-type').val(), parseInt(this.$('#field-goal-value').val(), 10));

    app.user.cache();

    app.user.save(null, {
      error: (req, error) => {
        this.displayErrorMessage(error.responseJSON.message);
      },
      success: () => {
        if (zhStudyStyleChanged) {
          this.dialog = new ResetVocablistPositionDialog();
          this.dialog.render();
          this.dialog.open();
        }

        app.notifyUser({
          message: 'Settings saved.',
          type: 'pastel-success',
        });
      },
    });
  },

  /**
   * @method remove
   * @returns {AccountSettingsStudyPage}
   */
  remove: function () {
    this.sidebar.remove();
    return GelatoPage.prototype.remove.call(this);
  },

});

module.exports = AccountSettingsStudyPage;
