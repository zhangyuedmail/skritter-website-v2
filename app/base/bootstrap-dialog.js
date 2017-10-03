let GelatoView = require('gelato/view');

/**
 * @class BootstrapDialog
 * @extends {GelatoView}
 */
module.exports = GelatoView.extend({
  /**
   * @property el
   * @type {String}
   */
  el: 'bootstrap-dialogs',
  /**
   * @property element
   * @type {jQuery}
   */
  element: null,
  /**
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {BootstrapDialog}
   */
  renderTemplate: function(context) {
    GelatoView.prototype.renderTemplate.call(this, context);
    this.element = this.$('[role="dialog"]');
    this.element.on('hide.bs.modal', _.bind(this.handleElementHide, this));
    this.element.on('hidden.bs.modal', _.bind(this.handleElementHidden, this));
    this.element.on('show.bs.modal', _.bind(this.handleElementShow, this));
    this.element.on('shown.bs.modal', _.bind(this.handleElementShown, this));
    return this;
  },
  /**
   * @method close
   * @returns {BootstrapDialog}
   */
  close: function() {
    this.element.modal('hide');
    return this;
  },
  /**
   * @method handleElementHide
   */
  handleElementHide: function() {
    this.trigger('hide');
  },
  /**
   * @method handleElementHidden
   */
  handleElementHidden: function() {
    this.trigger('hidden');
    this.remove();
  },
  /**
   * @method handleElementShow
   */
  handleElementShow: function() {
    this.trigger('show');
  },
  /**
   * @method handleElementShown
   */
  handleElementShown: function() {
    this.trigger('shown');
  },
  /**
   * @method open
   * @param {Object} [options]
   * @returns {BootstrapDialog}
   */
  open: function(options) {
    options = options || {};
    options.backdrop = options.backdrop || 'static';
    options.keyboard = options.keyboard || false;
    options.show = options.show || true;
    options.remote = options.remote || false;
    this.render().element.modal(options);
    return this;
  },
});
