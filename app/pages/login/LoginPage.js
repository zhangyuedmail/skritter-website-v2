const GelatoPage = require('gelato/page');

/**
 * @class LoginPage
 * @extends {GelatoPage}
 */
const LoginPage = GelatoPage.extend({

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
    'keyup #login-password': 'handleKeyUpLoginPassword',
    'click #button-login': 'handleClickLoginButton',
    'click #button-skeleton': 'handleClickSkeleton'
  },

  navbarOptions: {
    showBackBtn: true
  },

  /**
   * Whether to show the footer. On mobile, it should be hidden
   * @type {String}
   */
  showFooter: !app.isMobile(),

  /**
   * @property title
   * @type {String}
   */
  title: 'Login - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Login'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    app.mixpanel.track('Viewed login page');
  },

  /**
   * @method render
   * @returns {LoginPage}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileLogin.jade');
    }

    this.renderTemplate();

    this.$('#login-username').focus();

    return this;
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
          self.$('#login-message').html(error.responseJSON.message);
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
   * @returns {LoginPage}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});

module.exports = LoginPage;
