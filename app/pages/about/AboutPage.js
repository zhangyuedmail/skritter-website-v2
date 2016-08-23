const GelatoPage = require('gelato/page');

/**
 * @class AboutPage
 * @extends {GelatoPage}
 */
const AboutPage = GelatoPage.extend({

  /**
   * HTML Title text
   * @type {String}
   */
  title: 'About Us - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./About'),

  /**
   * @method render
   * @returns {AboutPage}
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

module.exports = AboutPage;
