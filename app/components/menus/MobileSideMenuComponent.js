const GelatoComponent = require('gelato/component');
const ConfirmGenericDialog = require('dialogs1/confirm-generic/view');

/**
 * A component that displays basic user info and provides a list of top-level
 * application navigation links.
 */
const MobileSideMenuComponent = GelatoComponent.extend({

  /**
   * CSS class for the element
   * @default
   */
  className: 'mobile-side-menu-component',

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-beacon': 'handleClickButtonBeacon',
    'click #logout-btn': 'handleLogoutButtonClick',
    'click #settings-btn': 'handleSettingsButtonClick',
    'click #menu-avatar': 'handleAvatarClick',
    'click #username': 'handleAvatarClick',
  },

  /**
   * Element tag name
   * @default
   */
  tagName: 'gelato-component',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./MobileSideMenu.jade'),

  /**
   * Initializes a mobile side menu component
   * @param {Object} options data needed to initialize the view
   * @param {UserModel} options.user the app's usermodel. Must be passed in
   *                                 due to global app variable not available yet.
   */
  initialize: function(options) {
    this.user = options.user;
    this.listenTo(this.user.stats, 'state:standby', this.updateStats);
    this.listenTo(this.user, 'change', this.updateUserInfo);
  },

  /**
   * Handles the user clicking on their avatar. Navigates to the user settings page
   * @param {jQuery} event
   */
  handleAvatarClick: function(event) {
    this.handleSettingsButtonClick(event);
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
   * Handles when the user clicks the logout button and initiates
   * the logout process.
   * @param {jQuery.Event} e the click event
   */
  handleLogoutButtonClick: function(e) {
    this._views['dialog'] = new ConfirmGenericDialog({
      body: 'This will fully log you out of your current account and return to the log in screen.',
      showButtonCancel: true,
      buttonConfirm: 'Log Out',
      buttonConfirmClass: 'btn-danger',
      title: 'Are you sure?',
    });

    this._views['dialog'].once(
      'confirm',
      function() {
        app.router.navigateLogout();
      }
    );

    this._views['dialog'].open();
  },

  /**
   * Handles when the user clicks the settings button and navigates to
   * the settings page.
   * @param {jQuery.Event} e the click event
   */
  handleSettingsButtonClick: function(e) {
    app.router.navigateAccountSettingsGeneral();
  },

  /**
   * Performs logic based on the changing visibility state of this component.
   * Called when it visually enters and exits the main frame.
   * @param {Boolean} show whether this component is being shown
   */
  toggleVisibility: function(show) {
    if (!show) {
      return;
    }

    if (app.user.stats.state !== 'fetching') {
      app.user.stats.fetchToday();
    }
    this.updateUserInfo();
  },

  /**
   * Updates UI to reflect the user's current state
   * @method updateUserInfo
   */
  updateUserInfo: function() {
    this.$('#username').text(this.user.get('name'));
    this.$('#menu-avatar').attr('src', 'data:image/png;base64, ' + app.user.get('avatar'));
  },

  /**
   * Updates the UI to reflect current stats values
   * @method updateStats
   */
  updateStats: function() {
    this.$('.num-chars').text(this.user.stats.getAllTimeCharactersLearned());
    this.$('.num-words').text(this.user.stats.getAllTimeWordsLearned());
  },

});

module.exports = MobileSideMenuComponent;
