var GelatoPage = require('gelato/page');
/**
 * @class Login
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    app.mixpanel.track('Viewed login page');
  },

  /**
   * @property title
   * @type {String}
   */
  title: 'Login - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {Login}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'keyup #login-password': 'handleKeyUpLoginPassword',
    'click #button-login': 'handleClickLoginButton',
    'click #button-skeleton': 'handleClickSkeleton'
  },

  /**
   * @method getFormData
   * @returns {Object}
   */
  getFormData: function() {
    return {
      password: this.$('#login-password').val(),
      username: this.$('#login-username').val()
    }
  },

  /**
   * @method handleClickLoginButton
   * @param {Event} event
   */
  handleClickLoginButton: function(event) {
    event.preventDefault();
    this.login();
  },

  /**
   * @method handleKeyUpLoginPassword
   * @param {Event} event
   */
  handleKeyUpLoginPassword: function(event) {
    event.preventDefault();
    if (event.which === 13 || event.keyCode === 13) {
      this.login();
    }
  },

  /**
   * @method handleClickSkeleton
   * @param {Event} event
   */
  handleClickSkeleton: function(event) {
    event.preventDefault();
    switch (app.getPlatform()) {
      case 'Android':
        this.$('#login-password').val('5f26f50983');
        break;
      case 'iOS':
        this.$('#login-password').val('40e9095b1d');
        break;
      case 'Website':
        this.$('#login-password').val('0e78bfa162');
        break;
    }
    this.login();
  },

  /**
   * @method login
   */
  login: function() {
    var self = this;
    var formData = this.getFormData();
    this.$('#login-message').empty();
    this.$('#login-form').prop('disabled', true);
    ScreenLoader.show();
    ScreenLoader.post('Authenticating user credentials');
    app.user.login(
      formData.username.trim(),
      formData.password.trim(),
      function(error) {
        if (error) {
          self.$('#login-message').text(error.responseJSON.message);
          self.$('#login-form').prop('disabled', false);
          ScreenLoader.hide();
        } else {
          app.router.navigate('dashboard', {trigger: false});
          app.reload();
        }
      }
    );
  },

  /**
   * @method remove
   * @returns {Login}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});
