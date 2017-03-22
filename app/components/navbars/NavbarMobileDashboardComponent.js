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
    vent.trigger('mobileNavMenu:toggle');
  },

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    app.user.stats.fetchToday();
  },
});

module.exports = NavbarMobileComponent;
