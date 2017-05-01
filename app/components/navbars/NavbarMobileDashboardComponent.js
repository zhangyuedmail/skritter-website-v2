const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const vent = require('vent');


const NavbarMobileComponent = NavbarDefaultComponent.extend({

  events: {
    'click #toggle-menu': 'handleToggleMenuClick',
    'click #back-btn': 'handleBackClick'
  },

  /**
   * Template to use
   */
  template: require('./NavbarMobileDashboard.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    options = options || {};
    const viewOptions = options.viewOptions || {};

    if (app.user.isLoggedIn()) {
      app.user.stats.fetchToday();
    }

    this.showBackBtn = viewOptions.showBackBtn;
  },

  /**
   * Handles the user
   * @param event
   */
  handleBackClick: function(event) {
    event.preventDefault();
    window.history.back();
  },

  /**
   *
   * @param event
   */
  handleToggleMenuClick: function(event) {
    event.preventDefault();
    vent.trigger('mobileNavMenu:toggle');
  }
});

module.exports = NavbarMobileComponent;
