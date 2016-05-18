var GelatoView = require('./view');

/**
 * @class GelatoComponent
 * @extends {GelatoView}
 */
var GelatoComponent = GelatoView.extend({
  /**
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {GelatoPage}
   */
  renderTemplate: function(context) {
    return GelatoView.prototype.renderTemplate.call(this, context);
  },
  /**
   * @method remove
   * @returns {GelatoPage}
   */
  remove: function() {
    return GelatoView.prototype.remove.call(this);
  }
});

module.exports = GelatoComponent;
