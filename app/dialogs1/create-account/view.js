let GelatoDialog = require('base/gelato-dialog');

/**
 * @class CreateAccountDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #create-account-button': 'createAccount',
    'submit #create-account-form': 'createAccount',
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {CreateAccountDialog}
   */
  render: function () {
    this.renderTemplate();
    return this;
  },
  /**
   * @method createAccount
   * @param {Event} event
   */
  createAccount: function (event) {
    const formData = this.getFormData();

    event.preventDefault();

    this.$('#error-message').empty();

    if (!this._validateEmail(formData.email)) {
      this.$('#error-message').text('Invalid email address format');

      return;
    }

    if (!this._validatePassword(formData.password)) {
      this.$('#error-message').text('Password must be between 6 and 256 characters');

      return;
    }

    ScreenLoader.show();
    ScreenLoader.post('Creating account');

    $.ajax({
      url: app.getApiUrl() + 'users',
      type: 'PUT',
      headers: app.user.session.getHeaders(),
      data: JSON.stringify({
        id: app.user.id,
        email: formData.email,
        name: formData.username,
        password: formData.password,
      }),
      error: (error) => {
        ScreenLoader.hide();

        this.$('#error-message').text(error.responseJSON.message);
        this.$('form').prop('disabled', false);
      },
      success: (result) => {
        app.user.set(result.User, {merge: true});
        app.user.cache();

        setTimeout(function () {
          app.reload();
        }, 1000);
      },
    });
  },
  /**
   * @method getFormData
   * @returns {Object}
   */
  getFormData: function () {
    return {
      email: this.$('#field-email').val(),
      password: this.$('#field-password').val(),
      username: this.$('#field-username').val(),
    };
  },
  _validateEmail: function (value) {
    return (!_.isEmpty(value) && value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/));
  },
  _validatePassword: function (value) {
    return (!_.isEmpty(value) && value.length >= 6 && value.length < 256);
  },
});
