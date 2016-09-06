const GelatoComponent = require('gelato/component');

/**
 * @class MarketingFooterComponent
 * @extends {GelatoComponent}
 */
const MarketingFooterComponent = GelatoComponent.extend({

  /**
   * CSS class for the element
   * @default
   */
  className: 'footer-container',

  /**
   * Id for the element
   */
  id: 'footer-container',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./MarketingFooter'),

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
   * @method render
   * @returns {MarketingFooterComponent}
   */
  render: function() {
    this.renderTemplate();

    if (this.className) {
      this.$('gelato-component').addClass(this.className);
    }

    return this;
  }

});

module.exports = MarketingFooterComponent;
