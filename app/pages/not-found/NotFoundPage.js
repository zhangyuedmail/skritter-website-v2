var GelatoPage = require('gelato/page');

/**
 * @class NotFoundPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

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
  title: 'Not Found - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./NotFound'),

  /**
   * @method render
   * @returns {NotFoundPage}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method remove
   * @returns {Contact}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});
