var GelatoPage = require('gelato/page');

/**
 * @class Home
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @property title
   * @type {String}
   */
  title: 'Home - Skritter',
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {Home}
   */
  render: function() {
    this.renderTemplate();
    return this;
  }
});
