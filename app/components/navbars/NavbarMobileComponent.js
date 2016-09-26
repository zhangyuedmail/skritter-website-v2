const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const vent = require('vent');

const NavbarMobileComponent = NavbarDefaultComponent.extend({

  /**
   * Template to use
   */
  template: require('./NavbarMobile.jade'),

  /**
   * Initializes a new NavbarMobileComponent
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(options) {
    this._currentSection = null;

    this.listenTo(vent, 'page:switch', this.handlePageSwitch);
  },

  /**
   * Gets the appropriate subview
   * @param {GelatoPage} page the instance of the new current page
   * @param {String} path the path of the
   */
  handlePageSwitch: function(page, path) {
    let header = page.header;

    if (!header && page.section) {
      // TODO
      // header = require('./' + section + 'NavbarComponent.js');
    } else {
      // TODO: parse path?
    }

    this.updateTitle(page.section || page.title);
  },

  /**
   * Updates the title section of the navbar
   * @param {String} title the title of the page
   */
  updateTitle: function(title) {
    // temporary hack until the titles are replaced by i18n variable references
    // and we can easily switch them out.
    // Just get the section name.
    let trimmedTitle = title.replace('-', '').replace('Skritter', '').trim();

    // And default to "Skritter" if we don't have a section name for some reason
    if (!trimmedTitle) {
      trimmedTitle = 'Skritter';
    }

    this.$('#title-txt').text(trimmedTitle);
  }
});

module.exports = NavbarMobileComponent;
