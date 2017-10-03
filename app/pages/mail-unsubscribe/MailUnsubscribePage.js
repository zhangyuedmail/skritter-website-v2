let GelatoPage = require('gelato/page');

/**
 * @class MailUnsubscribePage
 * @extends {GelatoPage}
 */
let MailUnsubscribe = GelatoPage.extend({

  /**
   * Describes a CSS class name for what type of background this page should have.
   * The class is applied higher up in the hierarchy than the page element.
   * @type {String}
   */
  background: 'marketing',

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
  template: require('./MailUnsubscribe'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.email = options.email;
  },

  /**
   * @method render
   * @returns {MailUnsubscribe}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method remove
   * @returns {MailUnsubscribe}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  },
});

module.exports = MailUnsubscribe;
