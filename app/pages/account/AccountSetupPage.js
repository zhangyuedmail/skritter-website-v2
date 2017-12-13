const GelatoPage = require('gelato/page');
let Vocablist = require('models/VocablistModel');

/**
 * @class AccountSetupPage
 * @extends {GelatoPage}
 */
const AccountSetupPage = GelatoPage.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'change #field-country': 'handleChangeFieldCountry',
    'change #field-language': 'handleChangeFieldLanguage',
    'click #button-next': 'handleClickButtonNext',
    'click #button-select-custom': 'handleClickButtonSelectCustom',
    'click #button-select-scratch': 'handleClickButtonSelectScratch',
    'click .lang-option': 'handleClickLangOption',
    'click .char-option': 'handleClickCharOption',
  },

  /**
   * @property settings
   * @type {Object}
   */
  settings: {
    addSimplified: true,
    addTraditional: false,
    addBoth: false,
    country: 'US',
    mode: 'settings',
    targetLang: app.getLanguage() || app.get('demoLang'),
    timezone: 'America/New_York',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./AccountSetup'),

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.accountSetup.title'),

  /**
   * @property showFooter
   * @type {Boolean}
   */
  showFooter: false,

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.countries = require('data/country-codes');
    this.timezones = require('data/country-timezones');
  },

  /**
   * @method render
   * @returns {AccountSetupPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileAccountSetup.jade');
    }

    if (app.isCordova()) {
      navigator.globalization.getDatePattern((tz) => {
        navigator.globalization.getPreferredLanguage((locale) => {
          console.log(locale, tz);

          this.settings.country = this.getCountryCode(locale.value);
          this.settings.timezone = this.getCountryTimezone(locale.value, tz.iana_timezone);

          this.renderTemplate();
          this.update();
        }, (error) => {
          this.renderTemplate();
          this.update();
        });
      }, (error) => {
        this.renderTemplate();
        this.update();
      });
    } else {
      this.settings.country = this.getCountryCode(navigator.language);
      this.settings.timezone = this.getCountryTimezone(navigator.language);

      this.renderTemplate();
      this.update();
    }

    return this;
  },

  update: function () {
    this.$('#character-style-section').toggleClass('hidden', this.settings.targetLang !== 'zh');
    this.$('#next-btn-wrapper').toggleClass('hidden', this.settings.mode === 'list');

    this.$('#simplified').toggleClass('selected', this.settings.addSimplified);
    this.$('#traditional').toggleClass('selected', this.settings.addTraditional);
    this.$('#both').toggleClass('selected', this.settings.addBoth);
  },

  getCountryCode: function (bcp47) {
    return this.countries[this.parseLocaleString(bcp47)] ? this.parseLocaleString(bcp47) : 'US';
  },

  getCountryTimezone: function (bcp47, tz) {
    const timezones = this.timezones[this.parseLocaleString(bcp47)][0];

    if (timezones && _.includes(timezones, tz)) {
      return timezones[tz];
    } else {
      return this.timezones[this.parseLocaleString(bcp47)][0] || 'America/New_York';
    }
  },

  parseLocaleString: function (value) {
    return _.upperCase(value.split('-')[1]);
  },

  /**
   * @method handleChangeFieldCountry
   * @param {Event} event
   */
  handleChangeFieldCountry: function (event) {
    event.preventDefault();
    this.settings.country = this.$('#field-country :selected').val() || 'US';
    this.render();
  },

  /**
   * @method handleChangeFieldLanguage
   * @param {Event} event
   */
  handleChangeFieldLanguage: function (event) {
    event.preventDefault();
    this.settings.targetLang = this.$('#field-language').val() || 'zh';
    this.update();
  },

  handleClickButtonNext: function () {
    event.preventDefault();

    this.settings.mode = 'list';
    this.render();
  },

  handleClickButtonSelectCustom: function (event) {
    event.preventDefault();

    this.saveSettings().then(() => {
      app.setSetting('newuser-' + app.user.id, true);
      app.router.navigate('vocablists/browse');
      app.reload();
    });
  },

  handleClickButtonSelectScratch: function (event) {
    const vocablist = new Vocablist({id: app.isChinese() ? '47872248' : '6020832698564608'});

    event.preventDefault();

    this.saveSettings().then(() => {
      ScreenLoader.post('Enabling vocablist');

      vocablist.save({
        studyingMode: 'adding',
      }, {
        error: (result, error) => {
          this.$('#error-message').text(error.responseJSON.message);
          ScreenLoader.hide();
        },
        success: () => {
          app.router.navigate('study');
          app.reload();
        },
      });
    });
  },

  handleClickCharOption: function (event) {
    let id = event.currentTarget.id;
    if (id === 'traditional') {
      this.settings.addTraditional = true;
      this.settings.addBoth = false;
      this.settings.addSimplified = false;
    } else if (id === 'both') {
      this.settings.addBoth = true;
      this.settings.addTraditional = false;
      this.settings.addSimplified = false;
    } else {
      this.settings.addSimplified = true;
      this.settings.addBoth = false;
      this.settings.addTraditional = false;
    }

    this.update();
  },

  handleClickLangOption: function (event) {
    event.preventDefault();
    let id = (event.currentTarget.id || '-').split('-')[1];
    this.settings.targetLang = id || 'zh';
    this.update();
  },

  /**
   * Processes the UI selections into values that can be passed onto the User model.
   * @method getSettings
   * @returns {Object}
   */
  getSettings: function () {
    let settings = {};
    let targetLang = this.settings.targetLang;
    if (targetLang === 'zh') {
      settings.addSimplified = this.settings.addSimplified || this.settings.addBoth;
      settings.addTraditional = this.settings.addTraditional || this.settings.addBoth;
      settings.reviewSimplified = true;
      settings.reviewTraditional = true;
    }
    settings.country = this.$('#field-country :selected').val();
    settings.targetLang = targetLang;
    settings.timezone = this.$('#field-timezone :selected').val();

    return settings;
  },

  /**
   * @method remove
   * @returns {Study}
   */
  remove: function () {
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * @method saveSettings
   * @param {Event} event
   */
  saveSettings: function () {
    let settings = this.getSettings();
    let invalidSettings = this.validateSettings(settings);

    if (invalidSettings) {
      this.$('#error-message').text(invalidSettings.message).removeClass('hidden');

      return;
    }

    this.$('#error-message').removeClass('hidden');

    ScreenLoader.show();
    ScreenLoader.post('Saving user settings');

    settings.id = app.user.id;

    return new Promise((resolve) => {
      app.user.save(
        settings,
        {
          patch: true,
          error: (user, error) => {
            this.$('#error-message').text(error.responseJSON.message);
            ScreenLoader.hide();
          },
          success: () => {
            resolve();
          },
        }
      );
    });
  },

  /**
   * Checks that the settings a user has chosen are valid to save
   * @param {Object} settings form settings to validate
   * @returns {Object} null if no error, object with a 'message' if there's a problem
   */
  validateSettings: function (settings) {
    let error = {};

    // user selected
    if (settings.targetLang === 'zh' && !settings.addSimplified && !settings.addTraditional) {
      error.message = app.locale('pages.accountSetup.errorNoCharacterTypeSelected');
      return error;
    }

    return null;
  },

});

module.exports = AccountSetupPage;
