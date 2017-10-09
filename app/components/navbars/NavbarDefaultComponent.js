const GelatoComponent = require('gelato/component');

/**
 * @class DefaultNavbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-beacon': 'handleClickButtonBeacon',
    'click #refer-link': 'handleClickReferLink',
    'click #switch-targetLang': 'handleClickSwitchTargetLang',
    'click .item-dropdown': 'handleClickDropdown',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./NavbarDefault.jade'),

  /**
   * @method render
   * @returns {DefaultNavbar}
   */
  render: function () {
    this.renderTemplate();
    this.$('[data-toggle="tooltip"]').tooltip();

    return this;
  },

  /**
   * Gets the first part of the URL fragment for the current route.
   * @todo More robust "sectioning" logic needed?
   * @returns {String} The section of the site the user is currently on.
   */
  getCurrentSection: function () {
    let history = null;

    // this could null out on app initialization.
    // should refactor whatever calls this before routing has officially started.
    if (Backbone.history.fragment) {
      history = Backbone.history.getFragment();
    } else {
      history = window.location.pathname.replace('/', '');
    }

    return history;
  },

  /**
   * Given a language code, returns the hanzi/kanji
   * representation of the language's name
   * @param {string} langCode the code of the language to get the characters for
   * @returns {string} the hanzi/kanji for the language name
   */
  getDisplayLanguageCharacters: function (langCode) {
    return langCode === 'zh' ? '中文' : '日本語';
  },

  /**
   * Given a language code following the format used for User.targetLang,
   * returns a localized displayable version of that code for use in templates.
   * E.g. 'zh' -> 'Chinese'
   * @param {string} [langCode] the language code you want to display
   * @return {string} a user-friendly version of the language code
   */
  getDisplayLanguageName: function (langCode) {
    langCode = langCode || app.user.get('targetLang');

    return langCode === 'zh' ? 'Chinese' : 'Japanese';
  },

  /**
   * @method handleClickButtonBeacon
   * @param {Event} event
   */
  handleClickButtonBeacon: function (event) {
    event.preventDefault();
    if (window.HS) {
      HS.beacon.open();
    }
  },

  /**
   * @method handleClickDropdown
   * @param {Event} event
   */
  handleClickDropdown: function (event) {
    event.preventDefault();

    let $dropdown = this.$('.item-dropdown');
    if ($dropdown.find('.dropdown').hasClass('hidden')) {
      $dropdown.addClass('open');
      $dropdown.find('.dropdown').removeClass('hidden');
    } else {
      $dropdown.removeClass('open');
      $dropdown.find('.dropdown').addClass('hidden');
    }
  },

  /**
   * Handles action when user wants to find their referral link.
   * @param {jQuery.Event} event the click event
   * @method handleClickReferLink
   */
  handleClickReferLink: function (event) {
    event.preventDefault();
    app.mixpanel.track('Clicked navbar refer link');
    app.router.navigate('refer', {trigger: true});
  },

  /**
   * Handles action when user wants to switch the target language they are studying.
   * @param {jQuery.Event} e the click event
   * @method handleClickSwitchTargetLang
   */
  handleClickSwitchTargetLang: function (e) {
    e.preventDefault();
    e.stopPropagation();

    let toSwitchCode = app.user.get('targetLang') === 'zh' ? 'ja' : 'zh';
    app.user.save({
      targetLang: toSwitchCode,
    }, {
      error: function (model, error) {
        ScreenLoader.hide();

        app.notifyUser({
          message: error.responseJSON.message,
        });
      },
      success: function () {
        app.reload(false);
      },
    });

    let loadingMessage = toSwitchCode === 'zh' ? 'Switching to Chinese' : 'Switching to Japanese';
    ScreenLoader.show();
    ScreenLoader.post(loadingMessage);
  },
});
