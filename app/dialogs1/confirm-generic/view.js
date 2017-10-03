const GelatoDialog = require('gelato/dialog');

/**
 * @class ConfirmGenericConfirm
 * @extends {GelatoDialog}
 */
const ConfirmGenericConfirm = GelatoDialog.extend({

  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    options = options || {};
    this.dialogBody = options.body || '';
    this.showButtonCancel = !_.isUndefined(options.showButtonCancel) ? options.showButtonCancel : true;
    this.dialogButtonCancel = options.buttonCancel || app.locale('common.cancel');
    this.dialogButtonConfirm = options.buttonConfirm || app.locale('common.confirm');
    this.dialogButtonConfirmClass = options.buttonConfirmClass || 'btn-danger';
    this.dialogTitle = options.title || app.locale('common.areYouSure');
  },

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-cancel': 'handleClickButtonCancel',
    'click #button-confirm': 'handleClickButtonConfirm',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {ConfirmGenericConfirm}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method handleClickButtonCancel
   * @param {Event} event
   */
  handleClickButtonCancel: function(event) {
    event.preventDefault();
    this.close();
  },

  /**
   * @method handleClickButtonConfirm
   * @param {Event} event
   */
  handleClickButtonConfirm: function(event) {
    event.preventDefault();
    this.trigger('confirm');
  },

});

module.exports = ConfirmGenericConfirm;
