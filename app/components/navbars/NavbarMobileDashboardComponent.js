const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const vent = require('vent');


const NavbarMobileComponent = NavbarDefaultComponent.extend({

  events: {
    'click #toggle-menu': 'handleToggleMenuClick'
  },

  /**
   * Template to use
   */
  template: require('./NavbarMobileDashboard.jade'),

  /**
   *
   * @param event
   */
  handleToggleMenuClick: function(event) {
    event.preventDefault();
    vent.trigger('sideMenu:toggle');
  }
});

module.exports = NavbarMobileComponent;
