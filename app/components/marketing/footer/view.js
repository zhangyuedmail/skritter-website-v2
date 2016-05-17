var GelatoComponent = require('gelato/component');

/**
 * @class MarketingFloor
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  initialize: function(options) {
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
