var GelatoPage = require('gelato/page');

/**
 * @class MailUnsubscribe
 * @extends {GelatoPage}
 */
var MailUnsubscribe = GelatoPage.extend({
  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.email = options.email;
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

    return this;
  },

  /**
   * @method remove
   * @returns {MailUnsubscribe}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});

module.exports = MailUnsubscribe;
