var GelatoView = require('./view');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components/marketing/footer/view');

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
    return GelatoView.prototype.renderTemplate.call(this, context);
  },
  /**
   * @method remove
   * @returns {GelatoPage}
   */
  remove: function() {
    return GelatoView.prototype.remove.call(this);
  }
});

module.exports = GelatoPage;
