var GelatoPage = require('gelato/page');

/**
 * @class About
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * HTML Title text
   * @type {String}
   */
  title: 'About Us - Skritter',

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
    if (app.user.isLoggedIn()) {
      this.$('#field-email').val(app.user.get('email'));
    }

    return this;
  },

  /**
   * @method remove
   * @returns {About}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});
