var GelatoView = require('gelato/view');

/**
 * @class BootstrapNavbar
 * @extends {GelatoView}
 */
module.exports = GelatoView.extend({
  /**
   * @property el
   * @type {String}
   */
  el: 'bootstrap-navbars',
  /**
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {BootstrapNavbar}
   */
  renderTemplate: function(context) {
    GelatoView.prototype.renderTemplate.call(this, context);
    return this;
  }
});
