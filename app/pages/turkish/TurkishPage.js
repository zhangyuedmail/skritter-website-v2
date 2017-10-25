const GelatoPage = require('gelato/page');

/**
 * @class TurkishPage
 * @extends {GelatoPage}
 */
const TurkishPage = GelatoPage.extend({

  /**
   * HTML Title text
   * @type {String}
   */
  title: 'Turkish - Skritter',

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
  template: require('./Turkish'),

  /**
   * @method render
   * @returns {TurkishPage}
   */
  render: function () {
    this.renderTemplate();

    return this;
  },

  /**
   * @method remove
   * @returns {TurkishPage}
   */
  remove: function () {
    return GelatoPage.prototype.remove.call(this);
  },

});

module.exports = TurkishPage;
