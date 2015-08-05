var GelatoPage = require('gelato/page');

/**
 * @class NotFound
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
  },
  /**
   * @property title
   * @type {String}
   */
  title: 'Not Found - Skritter',
  /**
   * @property template
   * @type {Function}
   */
  template: require('pages/not-found/template'),
  /**
   * @method render
   * @returns {NotFound}
   */
  render: function() {
    this.renderTemplate();
    return this;
  }
});
