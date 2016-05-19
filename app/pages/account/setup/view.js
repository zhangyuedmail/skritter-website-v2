var GelatoPage = require('gelato/page');
/**
 * @class AccountSetup
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.countries = require('data/country-codes');
    this.timezones = require('data/country-timezones');
  },
  /**
   * @property events
   * @type Object
   */
  events: {
    'change #field-country': 'handleChangeFieldCountry',
    'change #field-language': 'handleChangeFieldLanguage',
    'click #button-continue': 'handleClickButtonContinue'
  },
  /**
   * @property settings
   * @type {Object}
   */
  settings: {
    addSimplified: true,
    addTraditional: false,
    country: 'US',
    targetLang: app.get('demoLang'),
    timezone: 'America/New_York'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @property title
   * @type {String}
   */
  title: 'Account Configure - Skritter',

  showFooter: false,

  /**
   * @method render
   * @returns {Scratchpad}
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
    var self = this;
    event.preventDefault();
    ScreenLoader.show();
    ScreenLoader.post('Saving user settings');
    app.user.save(
      this.getSettings(),
      {
        error: function(user, error) {
          self.$('#error-message').text(error.responseJSON.message);
          ScreenLoader.hide();
        },
        success: function() {
          app.router.navigate('dashboard');
          app.reload();
        }
      }
    );
    this.render();
  },
  /**
   * @method getSettings
   * @returns {Object}
   */
  getSettings: function() {
    var settings = {};
    var targetLang = this.$('#field-language').val();
    if (targetLang === 'zh') {
      settings.addSimplified = this.$('#field-styles [value="simplified"]').is(':checked');
      settings.addTraditional = this.$('#field-styles [value="traditional"]').is(':checked');
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
  }
});
