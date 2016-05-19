var GelatoPage = require('gelato/page');
/**
 * @class Legal
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @property bodyClass
   * @type {String}
   */
  bodyClass: 'background2',

  /**
   * @property events
   * @type Object
   */
  events: {},

  /**
   * @property title
   * @type {String}
   */
  title: 'Legal - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {Legal}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method remove
   * @returns {Legal}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});
