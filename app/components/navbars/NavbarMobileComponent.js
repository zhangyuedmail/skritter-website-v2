const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');

const NavbarMobileComponent = NavbarDefaultComponent.extend({
  template: require('./NavbarMobile.jade')
});

module.exports = NavbarMobileComponent;
