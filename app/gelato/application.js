const DefaultNavbar = require('components/navbars/NavbarDefaultComponent');
const MobileNavbar = require('components/navbars/NavbarDefaultComponent');
const MarketingFooter = require('components/footers/MarketingFooterComponent');

/**
 * @class GelatoApplication
 * @extends {Backbone.View}
 */
const GelatoApplication = Backbone.View.extend({

  /**
   * The root element of the application
   * @type {String}
   * @default
   */
  tagName: 'gelato-application',

  /**
   * Default template for an application
   * @type {String}
   */
  template: require('./templates/application.jade'),

  /**
   * A dictionary of subviews
   * @type {Object<String, GelatoPage>}
   */
  _views: {},

  /**
   * A possible router the app should listen to.
   * This should be set by the individual app instance.
   * @type {GelatoRouter}
   * @protected
   */
  router: null,

  /**
   * Sets up initial app-level components and areas that will be used
   * throughout the lifetime of the application.
   * @param {Object} [options]
   * @param {String} [options.rootEl] the selector for the root element
   *                                  the application should bootstrap
   *                                  itself onto.
   */
  initialize: function(options) {
    options = options || {};

    this.rootSelector = options.rootSelector || 'body';

    this._views['page'] = null;
    this._views['defaultNavbar'] = new DefaultNavbar();
    this._views['mobileNavbar'] = new MobileNavbar();
    this._views['footer'] =  new MarketingFooter();
  },

  /**
   * Populates the root element
   * @returns {GelatoApplication}
   */
  render: function() {
    this.$el.html(this.template());

    if (this.isMobile()) {
      this.$el.addClass('mobile');
    }

    this.renderNavbar();
    this.renderFooter();

    return this;
  },

  /**
   * Renders the footer for the context
   * @method renderNavbar
   */
  renderFooter: function () {
    this.$('#footer-container').html(this._views['footer'].render().el);

    return this;
  },

  /**
   * Renders the correct navbar for the context
   * @method renderNavbar
   */
  renderNavbar: function() {

    // TODO: switch in mobile
    this._views['defaultNavbar'].setElement('#navbar-container').render();

    return this;
  },

  /**
   * @method getHeight
   * @returns {Number}
   */
  getHeight: function() {
    return Backbone.$('body').height();
  },

  /**
   * @method getLocalStorage
   * @param {String} key
   */
  getLocalStorage: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  /**
   * @method getPlatform
   * @returns {String}
   */
  getPlatform: function() {
    return window.device ? window.device.platform : 'Website';
  },

  /**
   * @method getSetting
   * @param {String} key
   * @returns {Boolean|Number|Object|String}
   */
  getSetting: function(key) {
    return JSON.parse(localStorage.getItem('application-' + key));
  },

  /**
   * @method getWidth
   * @returns {Number}
   */
  getWidth: function() {
    return Backbone.$('body').width();
  },

  /**
   * Replaces the current page of the application
   * @param {String} path the require path to load
   * @param {Object} [options] any options to send to the new instance of
   *                           the object loaded via the path
   * @returns {GelatoPage}
   * @method go
   */
  go: function(path, options) {
    if (this._views['page']) {

      if (this._views['page'].dialog) {
      this._views['page'].dialog.close();
      }
      // hack to remove bootstrap model backdrop
      $('.modal-backdrop').remove();

      this._views['page'].remove();
    }

    window.scrollTo(0, 0);
    this._views['page'] = new (require(path))(options);

    this.updatePage();
  },

  /**
   * @method isAndroid
   * @returns {Boolean}
   */
  isAndroid: function() {
    return this.getPlatform() === 'Android';
  },

  /**
   * @method isDevelopment
   * @returns {Boolean}
   */
  isDevelopment: function() {
    return location.hostname === 'localhost';
  },

  /**
   * @method isIOS
   * @returns {Boolean}
   */
  isIOS: function() {
    return this.getPlatform() === 'iOS';
  },

  /**
   * @method isLandscape
   * @returns {Boolean}
   */
  isLandscape: function() {
    return this.getWidth() > this.getHeight();
  },

  /**
   * @method isMobile
   * @returns {Boolean}
   */
  isMobile: function() {
    return this.isAndroid() || this.isIOS() || this.getWidth() < 768;
  },

  /**
   * @method isPortrait
   * @returns {Boolean}
   */
  isPortrait: function() {
    return this.getWidth() <= this.getHeight();
  },

  /**
   * @method isProduction
   * @returns {Boolean}
   */
  isProduction: function() {
    return location.hostname !== 'localhost';
  },

  /**
   * @method isWebsite
   * @returns {Boolean}
   */
  isWebsite: function() {
    return this.getPlatform() === 'Website';
  },

  /**
   * @method locale
   * @param {String} path
   * @param {String} [code]
   * @returns {*}
   */
  locale: function(path, code) {
    var locale = {};
    try {
      locale = require('locale/' + code || app.get('locale'));
    } catch (error) {
      locale = require('locale/default');
    }
    return _.get(locale, path);
  },

  /**
   * @method reload
   * @param {Boolean} [forcedReload]
   */
  reload: function(forcedReload) {
    location.reload(forcedReload);
  },

  /**
   * @method getLocalStorage
   * @param {String} key
   */
  removeLocalStorage: function(key) {
    localStorage.removeItem(key);
  },

  /**
   * @method removeSetting
   * @param {String} key
   */
  removeSetting: function(key) {
    localStorage.removeItem('application-' + key);
  },

  /**
   * @method setLocalStorage
   * @param {String} key
   * @param {Array|Number|Object|String} value
   */
  setLocalStorage: function(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * @method setSetting
   * @param {String} key
   * @param {Boolean|Number|Object|String} value
   */
  setSetting: function(key, value) {
    localStorage.setItem('application-' + key, JSON.stringify(value));
  },

  /**
   * Sets the title of the application.
   * @param title
   */
  setTitle: function(title) {
    if (title === this.title) {
      return;
    }

    document.title = title || app.get('title');

    this.trigger('title:change', title);
  },

  /**
   * Launches the application by kickstarting routing and rendering
   * the application.
   * @method start
   */
  start: function() {
    $(this.rootSelector).prepend(this.render().$el);

    if (this.router) {
      this.listenTo(this.router, 'page:navigate', this.go, this);
    }
  },

  /**
   * Shows or hides the footer element
   * @param {Boolean} [show] whether to show or hide the footer
   */
  toggleFooter: function(show) {
    this.$('#footer-container').toggle(show);
  },

  /**
   * Shows or hides the navbar element
   * @param show
   */
  toggleNavbar: function(show) {
    let navbarContainer = this.$('#navbar-container');
    /*
    if (this._views['page'].showNavbar) {
      this.showNavbar();
      if (app.isMobile()) {
        this.$view.prepend(this.navbar.render().el);
      } else {
        this.$view.prepend(this.navbar.render().el);
      }
    }
     */
    navbarContainer.toggle(show);

    // navbar could possibly need to be updated since the last time it was
    // shown--it could have been swapped out with another navbar for instance
    if (navbarContainer.is(':visible')) {
      this.renderNavbar();
    }
  },

  /**
   * Updates the application to show the specified page.
   * Defaults to the 'page' subview.
   * @param {GelatoPage} [page]
   */
  updatePage: function(page) {
    page = page || this._views['page'];

    this.toggleNavbar(this._views['page'].showNavbar);
    this.toggleFooter(this._views['page'].showFooter);

    this._views['page'].setElement('#page-container').render();
  }
});

module.exports = GelatoApplication;
