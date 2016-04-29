var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components/marketing/footer/view');


/**
 * @class MailUnsubscribe
 * @extends {GelatoPage}
 */
var MailUnsubscribe = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.footer = new MarketingFooter();
    this.navbar = new DefaultNavbar();
  },
  /**
   * @property bodyClass
   * @type {String}
   */
  bodyClass: 'background2',
  /**
   * @property title
   * @type {String}
   */
  title: 'Mail Unsubscribe - Skritter',
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {MailUnsubscribe}
   */
  render: function() {
    this.renderTemplate();
    this.footer.setElement('#footer-container').render();
    this.navbar.setElement('#navbar-container').render();
    return this;
  },
  /**
   * @method remove
   * @returns {MailUnsubscribe}
   */
  remove: function() {
    this.navbar.remove();
    this.footer.remove();
    return GelatoPage.prototype.remove.call(this);
  }
});

module.exports = MailUnsubscribe;
