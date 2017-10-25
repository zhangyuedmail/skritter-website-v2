let GelatoView = require('./view');

/**
 * @class GelatoDialog
 * @extends {GelatoView}
 */
let GelatoDialog = GelatoView.extend({
  /**
   * @property el
   * @type {String}
   */
  el: 'gelato-dialogs',

  /**
   * @property element
   * @type {jQuery}
   */
  element: null,

  /**
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {GelatoDialog}
   */
  renderTemplate: function (context) {
    GelatoView.prototype.renderTemplate.call(this, context);
    this.element = this.$('[role="dialog"]');
    this.element.on('hide.bs.modal', this.handleElementHide.bind(this));
    this.element.on('hidden.bs.modal', this.handleElementHidden.bind(this));
    this.element.on('show.bs.modal', this.handleElementShow.bind(this));
    this.element.on('shown.bs.modal', this.handleElementShown.bind(this));

    return this;
  },

  /**
   * @method close
   * @returns {GelatoDialog}
   */
  close: function () {
    // TODO: figure out why the element is getting unset on study screens
    if (!this.element) {
      this.element = this.$('[role="dialog"]');
    }

    this.element.modal('hide');
    return this;
  },

  /**
   * @method handleElementHide
   */
  handleElementHide: function () {
    this.trigger('hide');
  },

  /**
   * @method handleElementHidden
   */
  handleElementHidden: function () {
    this.trigger('hidden');
    this.remove();
  },

  /**
   * @method handleElementShow
   */
  handleElementShow: function () {
    this.trigger('show');
  },

  /**
   * @method handleElementShown
   */
  handleElementShown: function () {
    this.trigger('shown');
  },

  /**
   * @method open
   * @param {Object} [options]
   * @returns {GelatoDialog}
   */
  open: function (options) {
    options = _.defaults(
      options || {},
      {
        backdrop: 'static',
        keyboard: false,
        show: true,
        remote: false,
      }
    );
    this.render();
    this.element.modal(options);

    return this;
  },
});

module.exports = GelatoDialog;
