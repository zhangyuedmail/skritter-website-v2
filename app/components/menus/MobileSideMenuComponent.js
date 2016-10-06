const GelatoComponent = require('gelato/component');

/**
 * A component that displays basic user info and provides a list of top-level
 * application navigation links.
 */
const MobileSideMenuComponent = GelatoComponent.extend({

  /**
   * Element tag name
   * @default
   */
  tagName: 'gelato-component',

  /**
   * CSS class for the element
   * @default
   */
  className: 'mobile-side-menu-component',

  events: {
    'click #logout-btn': 'handleLogoutButtonClick',
    'click #settings-btn': 'handleSettingsButtonClick',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./MobileSideMenu.jade'),

  initialize: function(options) {
    this.user = options.user;
    this.listenTo(this.user, 'change:name', this.updateUsername);
  },

  updateUsername: function() {
    this.$('#username').text(this.user.get('name'));
  },

  handleLogoutButtonClick: function(e) {
    app.router.navigateLogout();
  },

  handleSettingsButtonClick: function(e) {
    app.router.navigateAccountSettingsGeneral();
  }
});

module.exports = MobileSideMenuComponent;
