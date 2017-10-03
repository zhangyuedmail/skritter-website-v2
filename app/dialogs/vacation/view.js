let BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class VacationDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function (options) {
    this.subscription = options.subscription;
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {VacationDialog}
   */
  render: function () {
    this.renderTemplate();
    return this;
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
   * @method handleClickButtonCancel
   * @param {Event} event
   */
  handleClickButtonCancel: function (event) {
    event.preventDefault();
    this.close();
  },
  /**
   * @method handleClickButtonConfirm
   * @param {Event} event
   */
  handleClickButtonConfirm: function (event) {
    event.preventDefault();
    this.$('#button-confirm').hide();
    this.$('.fa-spinner').removeClass('hide');
    let option = this.$('select option:selected');
    let startDate = moment().add(2, 'days');
    let endDate = startDate.clone().add(
      option.data('number'), option.data('unit')
    );
    let format = 'YYYY-MM-DD';
    let attrs = {
      'vacation': {
        start: startDate.format(format),
        end: endDate.format(format),
      },
    };
    let dialog = this;
    this.subscription.save(attrs, {
      parse: true,
      method: 'PUT',
      complete: function () {
        dialog.close();
      },
    });
  },
});
