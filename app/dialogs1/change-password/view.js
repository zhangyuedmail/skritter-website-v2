let GelatoDialog = require('base/gelato-dialog');

/**
 * @class ChangePasswordDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-cancel': 'handleClickButtonCancel',
    'click #button-change': 'handleClickButtonChange',
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {ConfirmDialog}
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
   * @method handleClickButtonChange
   * @param {Event} event
   */
  handleClickButtonChange: function(event) {
    let self = this;
    event.preventDefault();
    let password1 = this.$('#field-password1').val();
    let password2 = this.$('#field-password2').val();
    this.$('#error-message').empty();
    this.$('form').prop('disabled', true);
    if (password1.length < 6) {
      this.$('#error-message').text('Password must be at least 6 characters.');
      this.$('form').prop('disabled', false);
      return;
    }
    if (password1 !== password2) {
      this.$('#error-message').text('Passwords must match.');
      this.$('form').prop('disabled', false);
      return;
    }
    ScreenLoader.show();
    ScreenLoader.post('Changing user password');
    $.ajax({
      data: JSON.stringify({
        id: app.user.id,
        password: password1,
      }),
      headers: app.user.session.getHeaders(),
      type: 'PUT',
      url: app.getApiUrl() + 'users',
      error: function(error) {
        ScreenLoader.hide();
        self.$('#error-message').text(error.responseJSON.message);
        self.$('form').prop('disabled', false);
      },
      success: function() {
        self.close();
        setTimeout(
          function() {
            ScreenLoader.hide();
          },
          1000
        );
      },
    });
  },
});
