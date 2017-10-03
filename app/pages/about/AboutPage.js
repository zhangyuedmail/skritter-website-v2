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
   * Describes a CSS class name for what type of background this page should have.
   * The class is applied higher up in the hierarchy than the page element.
   * @type {String}
   */
  background: 'marketing',

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
  },

});

module.exports = AboutPage;
