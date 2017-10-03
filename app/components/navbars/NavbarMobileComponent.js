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
  initialize: function (options) {
    this.listenTo(vent, 'page:switch', this.handlePageSwitch);
  },

  /**
   * Gets the appropriate subview
   * @param {GelatoPage} page the instance of the new current page
   * @param {String} path the path of the
   */
  handlePageSwitch: function (page, path) {
    this.updateSubNavbar(page);
    this.updateTitle(page.section || page.title);
  },

  /**
   *
   * @param event
   */
  handleToggleMenuClick: function (event) {
    event.preventDefault();
    vent.trigger('mobileNavMenu:toggle');
  },

  /**
   * Renders a subnavbar component
   * @returns {NavbarMobileComponent}
   */
  renderSubNavbar: function () {
    if (!this._views['subNavbar']) {
      return;
    }
    this.$('#sub-navbar-container').html(this._views['subNavbar'].render().el);

    return this;
  },

  /**
   *
   * @param {GelatoPage} page the current page
   */
  updateSubNavbar: function (page) {
    const Navbar = this._getNavbarFromPage(page);

    if (!Navbar) {
      return;
    }

    if (this._views['subNavbar']) {
      this._views['subNavbar'].remove();
    }

    this._views['subNavbar'] = new Navbar({
      page: page,
      rootMenu: this,
      viewOptions: page.navbarOptions,
    });

    this.renderSubNavbar();
  },

  /**
   * Updates the title section of the navbar
   * @param {String} title the title of the page
   */
  updateTitle: function (title) {
    // temporary hack until the titles are replaced by i18n variable references
    // and we can easily switch them out.
    // Just get the section name.
    let trimmedTitle = title.replace('-', '').replace('Skritter', '').trim();

    // And default to "Skritter" if we don't have a section name for some reason
    if (!trimmedTitle) {
      trimmedTitle = 'Skritter';
    }

    this.$('#title-txt').text(trimmedTitle);
  },

  /**
   * Given a page, finds the specific mobile navbar associated with that page,
   * if it's defined.
   * @param {GelatoPage} page the instance of the page to look at
   * @private
   */
  _getNavbarFromPage: function (page) {
    let navbar = page.mobileNavbar;

    if (!navbar) {
      // Hack until all pages get their own mobile navbars made
      // TODO: make default mobile navbar with just a hamburger button and
      // "Skritter" for the title?
      navbar = require('./NavbarMobileDashboardComponent.js');
    }

    return navbar;
  },
});

module.exports = NavbarMobileComponent;
