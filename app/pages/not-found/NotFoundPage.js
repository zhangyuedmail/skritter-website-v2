var GelatoPage = require('gelato/page');

/**
 * @class NotFoundPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  
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
