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
  }
});

module.exports = MobileSideMenuComponent;
