const GelatoView = require('./view');

/**
 * @class GelatoPage
 * @extends {GelatoView}
 */
const GelatoPage = GelatoView.extend({

  /**
   * @property el
   * @type {String}
   */
  el: 'gelato-page',

  /**
   * @property title
   * @type {Function|String}
   */
  title: null,

  /**
   * Whether to show the footer on the page
   * @type {Boolean}
   */
  showFooter: true,

  /**
   * Whether to show the navbar on the page
   * @type {Boolean}
   */
  showNavbar: true,

  constructor: function() {
    GelatoView.prototype.constructor.apply(this, arguments);
  },

  /**
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {GelatoPage}
   */
  renderTemplate: function(context) {
    app.setTitle(this.title);

    GelatoView.prototype.renderTemplate.call(this, context);

    return this;
  },

  /**
   * @method remove
   * @returns {GelatoPage}
   */
  remove: function() {
    return GelatoView.prototype.remove.call(this);
  },
});

module.exports = GelatoPage;
