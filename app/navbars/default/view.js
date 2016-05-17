var BootstrapNavbar = require('base/bootstrap-navbar');
var ConfirmLogoutDialog = require('dialogs/confirm-logout/view');

/**
 * @class DefaultNavbar
 * @extends {BootstrapNavbar}
 */
module.exports = BootstrapNavbar.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-beacon': 'handleClickButtonBeacon',
    'click #button-logout': 'handleClickButtonLogout',
    'click #switch-targetLang': 'handleClickSwitchTargetLang',
    'click .item-dropdown': 'handleClickDropdown'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {DefaultNavbar}
   */
  render: function() {
    this.renderTemplate();
    this.$('[data-toggle="tooltip"]').tooltip();
    return this;
  },

  /**
   * Gets the first part of the URL fragment for the current route.
   * @todo More robust "sectioning" logic needed?
   * @returns {String} The section of the site the user is currently on.
   */
  getCurrentSection: function() {
    return Backbone.history.getFragment().split('/')[0];
  },

  /**
   * Given a language code, returns the hanzi/kanji
   * representation of the language's name
   * @param {string} langCode the code of the language to get the characters for
   * @returns {string} the hanzi/kanji for the language name
   */
  getDisplayLanguageCharacters: function(langCode) {
    return langCode === 'zh' ? '中文' : '日本語';
  },

  /**
   * Given a language code following the format used for User.targetLang,
   * returns a localized displayable version of that code for use in templates.
   * E.g. 'zh' -> 'Chinese'
   * @param {string} [langCode] the language code you want to display
   * @return {string} a user-friendly version of the language code
   */
  getDisplayLanguageName: function(langCode) {
    langCode = langCode || app.user.get('targetLang');

    return langCode === 'zh' ? 'Chinese' : 'Japanese';
  },

  /**
   * @method handleClickButtonBeacon
   * @param {Event} event
   */
  handleClickButtonBeacon: function(event) {
    event.preventDefault();
    if (window.HS) {
      HS.beacon.open();
    }
  },

  /**
   * @method handleClickButtonLogout
   * @param {Event} event
   */
  handleClickButtonLogout: function(event) {
    event.preventDefault();
    var dialog = new ConfirmLogoutDialog();
    dialog.on('logout', function() {
      app.user.logout();
    });
    dialog.open();
  },

  /**
   * @method handleClickDropdown
   * @param {Event} event
   */
  handleClickDropdown: function(event) {
    event.preventDefault();

    var $dropdown = this.$('.item-dropdown');
    if ($dropdown.find('.dropdown').hasClass('hidden')) {
      $dropdown.addClass('open');
      $dropdown.find('.dropdown').removeClass('hidden');
    } else {
      $dropdown.removeClass('open');
      $dropdown.find('.dropdown').addClass('hidden');
    }
  },

  handleClickSwitchTargetLang: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var toSwitchCode = app.user.get('targetLang') === 'zh' ? 'ja' : 'zh';
    app.user.save({
      targetLang: toSwitchCode
    }, {
      error: function() {
        //TODO: show some kind of error message
        ScreenLoader.hide();
      },
      success: function() {
        window.location.reload(false);
      }
    });

    var loadingMessage = toSwitchCode === 'zh' ? 'Switching to Chinese' : 'Switching to Japanese';
    ScreenLoader.show();
    ScreenLoader.post(loadingMessage);
  }
});
