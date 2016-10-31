var GelatoPage = require('gelato/page');

/**
 * @class PasswordResetPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * Describes a CSS class name for what type of background this page should have.
   * The class is applied higher up in the hierarchy than the page element.
   * @type {String}
   */
  background: 'marketing',

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'submit #password-reset-form': 'handleClickButtonReset'
  },

  showFooter: !app.isMobile(),

  /**
   * @property template
   * @type {Function}
   */
  template: require('./PasswordReset'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Reset Password - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.choices = [];
    this.errorMessage = null;
  },

  /**
   * @method render
   * @returns {PasswordResetPage}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobilePasswordReset.jade');
    }

    this.renderTemplate();

    return this;
  },

  /**
   * @method handleClickButtonReset
   * @param {Event} event
   */
  handleClickButtonReset: function(event) {
    event.preventDefault();

    var email = this.$('#password-reset-input').val().trim();

    if (!this.choices.length && (email.indexOf('@') < 1 || email.indexOf('.') < 2)) {
      this._displayValidationErrorMessage(app.locale('pages.signup.errorInvalidEmail'));
      return;
    }

    this.resetPassword(email);
  },

  /**
   * @method resetPassword
   * @param {String} email the email of the account for which to reset the passwrod
   */
  resetPassword: function(email) {
    var self = this;

    this.$('#password-reset-form').prop('disabled', true);
    this.$('#validation-error-alert').text('');
    this.errorMessage = null;

    ScreenLoader.show();
    ScreenLoader.post('Recovering user credentials');

    $.ajax({
      url: app.getApiUrl() + 'reset-password',
      type: 'POST',
      headers: app.user.session.getHeaders(),
      data: JSON.stringify({input: email}),
      error: function(error) {
        var response = error.responseJSON;
        if (response.choices) {
          self.choices = _.sortBy(response.choices, 'name');
        } else {
          self.errorMessage = response.message;
          self.choices = [];
        }
        self.$('#password-reset-form').prop('disabled', false);
        self.render();
        ScreenLoader.hide();
      },
      success: function() {
        self.choices = [];
        self.successMessage = 'A temporary password has been emailed to you.';
        self.render();
        self.$('#password-reset-form').hide();
        ScreenLoader.hide();
      }
    });
  },

  /**
   * Displays a validation error message to the user
   * @param {String} message the message to display
   * @private
   */
  _displayValidationErrorMessage: function(message) {
    this.$('#validation-error-alert').text(message);
  }

});
