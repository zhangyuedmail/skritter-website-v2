const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const vent = require('vent');

const NavbarMobileListsComponent = NavbarDefaultComponent.extend({

  events: {
    'click #toggle-menu': 'handleToggleMenuClick'
  },

  /**
   * Template to use
   */
  template: require('./NavbarMobileLists.jade'),

  /**
   *
   * @param event
   */
  handleToggleMenuClick: function(event) {
    event.preventDefault();
    vent.trigger('sideMenu:toggle');
  }
});

module.exports = NavbarMobileListsComponent;
