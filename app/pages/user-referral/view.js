var GelatoPage = require('gelato/page');

/**
 * @class About
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  events: {
    'click #user-link': 'handleUserLinkClicked'
  },
  /**
   * HTML Title text
   * @type {String}
   */
  title: 'User Referrals - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {About}
   */
  render: function() {
    this.renderTemplate();
    var self = this;

    _.defer(function() {
      self.$('#user-link').select().focus();
    });

    return this;
  },

  /**
   * @method remove
   * @returns {About}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Selects the user's referral link when they click on it.
   * @method handleUserLinkClicked
   */
  handleUserLinkClicked: function() {
    this.$('#user-link').select();
  }
});
