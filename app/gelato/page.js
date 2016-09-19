var GelatoView = require('./view');
var DefaultNavbar = require('components/navbars/NavbarDefaultComponent');
var MarketingFooter = require('components/marketing/MarketingFooterComponent');

/**
 * @class GelatoPage
 * @extends {GelatoView}
 */
var GelatoPage = GelatoView.extend({

  /**
   * @property el
   * @type {String}
   */
  el: 'gelato-application',

  /**
   * @property title
   * @type {Function|String}
   */
  title: null,

  /**
   * A footer with additional links and resources
   * @type {MarketingFooter}
   */
  footer: new MarketingFooter(),

  /**
   * A navigation bar
   * @type {DefaultNavbar}
   */
  navbar: new DefaultNavbar(),

  /**
   * Whether to show the footer on the page
   * @type {Boolean}
   */
  showFooter: true,

  /**
   * Whether to show the navbar on the page
   * @type {Boolean}
   */
  showNavbar: true,

  /**
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {GelatoPage}
   */
  renderTemplate: function(context) {
    document.title = _.result(this, 'title', app.get('title'));

    GelatoView.prototype.renderTemplate.call(this, context);

    if (this.showNavbar) {
      // why is this.navbar.el null??
      // GelatoView for navbar vs GelatoComponent for footer?
      this.$view.prepend(this.navbar.render().el);
    }

    if (this.showFooter) {
      this.$view.append(this.footer.render().el);
    }

    return this;
  },
  /**
   * @method remove
   * @returns {GelatoPage}
   */
  remove: function() {
    this.footer.remove();
    this.navbar.remove();

    return GelatoView.prototype.remove.call(this);
  }
});

module.exports = GelatoPage;
