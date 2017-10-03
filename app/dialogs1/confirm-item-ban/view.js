let GelatoDialog = require('base/gelato-dialog');

/**
 * @class ConfirmItemBanDialog
 * @extends {GelatoDialog}
 */
let Dialog = GelatoDialog.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-ban-all': 'handleClickButtonBanAll',
    'click #button-ban-part': 'handleClickButtonBanPart',
    'click #button-cancel': 'handleClickButtonCancel',
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    this.item = options.item;
    this.vocab = options.vocab;
  },
  /**
   * @method render
   * @returns {ConfirmItemBanDialog}
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
   * @method handleClickButtonBanAll
   * @param {Event} event
   */
  handleClickButtonBanAll: function(event) {
    event.preventDefault();
    this.vocab.banAll();
    this.vocab.save();
    this.trigger('confirm');
  },
  /**
   * @method handleClickButtonBanPart
   * @param {Event} event
   */
  handleClickButtonBanPart: function(event) {
    event.preventDefault();
    this.item.set('vocabIds', []);
    this.vocab.banPart(this.item.get('part'));
    this.vocab.save();
    this.trigger('confirm');
  },
});

module.exports = Dialog;
