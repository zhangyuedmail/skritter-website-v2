var GelatoComponent = require('gelato/component');

/**
 * @class MarketingFloor
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * Id for the element
   */
  id: 'footer-container',

  /**
   * CSS class for the element
   * @default
   */
  className: 'footer-container',

  /**
   * Initializes a new footer
   * @param {Object} [options] a map of options for the view
   * @param {String} [options.theme] a CSS class to apply to the footer
   */
  initialize: function(options) {
    options = options || {};

    if (options.theme) {
      this.className = options.theme;
    }
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {GelatoComponent}
   */
  render: function() {
    this.renderTemplate();

    if (this.className) {
      this.$('gelato-component').addClass(this.className);
    }

    return this;
  }
});
