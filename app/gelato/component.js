const GelatoView = require('./view');

/**
 * @class GelatoComponent
 * @extends {GelatoView}
 */
const GelatoComponent = GelatoView.extend({

  /**
   * Instance variable to represent whether the component has fully loaded
   * @type {Boolean}
   */
  loaded: false,

  /**
   * Renders a component's template with a supplied context
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {GelatoPage}
   */
  renderTemplate: function (context) {
    return GelatoView.prototype.renderTemplate.call(this, context);
  },

  /**
   * Removes a component and any listeners
   * @method remove
   * @returns {GelatoPage}
   */
  remove: function () {
    return GelatoView.prototype.remove.call(this);
  },
});

module.exports = GelatoComponent;
