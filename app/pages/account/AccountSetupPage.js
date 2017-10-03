const GelatoPage = require('gelato/page');

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
    'click #button-continue': 'handleClickButtonContinue',
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
    targetLang: app.get('demoLang'),
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
  initialize: function() {
    this.countries = require('data/country-codes');
    this.timezones = require('data/country-timezones');
  },

  /**
   * @method render
   * @returns {AccountSetupPage}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method handleChangeFieldCountry
   * @param {Event} event
   */
  handleChangeFieldCountry: function(event) {
    event.preventDefault();
    this.settings.country = this.$('#field-country :selected').val() || 'US';
    this.render();
  },

  /**
   * @method handleChangeFieldLanguage
   * @param {Event} event
   */
  handleChangeFieldLanguage: function(event) {
    event.preventDefault();
    this.settings.targetLang = this.$('#field-language').val() || 'zh';
    this.render();
  },

  /**
   * @method handleClickButtonContinue
   * @param {Event} event
   */
  handleClickButtonContinue: function(event) {
    let self = this;
    event.preventDefault();
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

    app.user.save(
      settings,
      {
        patch: true,
        error: function(user, error) {
          self.$('#error-message').text(error.responseJSON.message);
          ScreenLoader.hide();
        },
        success: function() {
          app.setSetting('newuser-' + app.user.id, true);
          app.router.navigate('vocablists/browse');
          app.reload();
        },
      }
    );
    this.render();
  },

  handleClickCharOption: function(event) {
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

    this.render();
  },

  handleClickLangOption: function(event) {
    event.preventDefault();
    let id = (event.currentTarget.id || '-').split('-')[1];
    this.settings.targetLang = id || 'zh';
    this.render();
  },

  /**
   * Processes the UI selections into values that can be passed onto the User model.
   * @method getSettings
   * @returns {Object}
   */
  getSettings: function() {
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
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Checks that the settings a user has chosen are valid to save
   * @param {Object} settings form settings to validate
   * @returns {Object} null if no error, object with a 'message' if there's a problem
   */
  validateSettings: function(settings) {
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
