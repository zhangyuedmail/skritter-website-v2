var GelatoPage = require('gelato/page');
var User = require('models/UserModel');

/**
 * A page that allows a user to create account for Skritter by entering
 * user credentials, subscription options, and payment information.
 * @class SignupPage
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
   * @type Object
   */
  events: {
    'change #signup-payment-method': 'handleChangeSignupPaymentMethod',
    'click #signup-submit': 'handleClickSignupSubmit',
    'click #send-validation-email': 'handleClickValidateSchoolEmail'
  },

  navbarOptions: {
    showBackBtn: true
  },

  /**
   * The different subscription options available for purchase
   * @type {Array<Object>}
   */
  products: [
    {
      'fullName': '$14.99/month',
      'key': 'one_month',
      'months': 1,
      'name': '1 month',
      'price': '14.99'
    },
    {
      'fullName': '$59.99/6 months ($10.00/month)',
      'key': 'six_months',
      'months': 6,
      'name': '6 months',
      'price': '59.99'
    },
    {
      'fullName': '$99.99/12 months ($8.33/month)',
      'key': 'twelve_months',
      'months': 12,
      'name': '1 year',
      'price': '99.99'
    },
    {
      'fullName': '$179.99/24 months ($7.50/month)',
      'key': 'twenty_four_months',
      'months': 24,
      'name': '2 years',
      'price': '179.99'
    }
  ],

  /**
   * The template to render
   * @type {Function}
   */
  template: require('./Signup.jade'),

  /**
   * The page title to display
   * @type {String}
   */
  title: app.locale('common.signUp') + ' - Skritter',

  /**
   * Creates a new Signup View.
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    _.bindAll(this, '_saveNewUser');

    this.plan = options.plan;
    this.subscribing = false;
    this.user = new User();
    this.userReferral = app.getUserReferral();
    this.couponCode = app.getStoredCouponCode();

    app.mixpanel.track('Viewed signup page');
  },

  /**
   * @method render
   * @returns {SignupPage}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileSignup.jade');
    }

    this.renderTemplate();

    if (app.isDevelopment()) {
      this.$('#signup-username').val('tester1');
      this.$('#signup-email').val('josh@skritter.com');
      this.$('#signup-password1').val('skrit123');
      this.$('#signup-password2').val('skrit123');
      this.$('#signup-card-number').val('4242424242424242');
      this.$('#card-month-select').val('01');
      this.$('#card-year-select').val(new Date().getFullYear() + 1);
    }

    if (this.couponCode) {
      this.setCouponCode(this.couponCode);
    }

    return this;
  },

  /**
   * Creates a new user from pre-validated form data. Performs the necessary
   * requests to create payment and user data.
   * @param {Object} formData dictionary of user form data
   * @param {Function} callback called when all requests relating to user creation have completed
   */
  createUser: function(formData, callback) {
    var self = this;
    var siteRef = app.getRefererId();

    this.user.set({
      email: formData.email,
      method: formData.method,
      name: formData.username,
      password: formData.password1,
      recaptcha: formData.recaptcha,
      siteRef: siteRef
    });

    if (formData.method === 'credit') {
      this.user.set({
        plan: formData.plan,
        token: formData.token
      });
    } else if (formData.method === 'coupon') {
      this.user.set('couponCode', formData.coupon);
      this.couponCode = formData.coupon;
      app.couponCode = formData.coupon;
    } else {
      this.user.set('validationCode', formData.validationCode);
    }

    if (app.isDevelopment()) {
      this.user.unset('avatar');
    }

    // TODO: detect this? Default it earlier?
    this.user.set('client', 'website');

    async.series([
      this._saveNewUser,
      function(callback) {
        app.user.login(
          formData.username,
          formData.password1,
          function(error) {
            if (error) {
              callback(error);
            } else {
              // set mixpanel alias before signup
              mixpanel.alias(self.user.id);

              // track mixpanel signup event
              app.mixpanel.track(
                'Signup',
                {
                  'Display Name': self.user.get('name'),
                  'Method': formData.method,
                  'Plan': formData.plan
                }
              );

              // track facebook pixel registration events
              if (window.fbq && app.isWebsite()) {
                window.fbq('track', 'CompleteRegistration');
              }

              // coupon's been used, clear it from cache
              app.couponCode = null;
              app.removeSetting('coupon');

              callback();
            }
          }
        )
      },
      this._processUserReferral
    ], callback);
  },

  /**
   * Displays an error messsage about the form data to the user
   * @param {String} message the error to show to the user
   */
  displayErrorMessage: function(message) {
    this.$('#signup-error-alert').html(message).removeClass('hidden');
  },

  /**
   * @method getFormData
   * @returns {Object}
   */
  getFormData: function() {
    return {
      card: {
        expires_month: this.$('#card-month-select').val(),
        expires_year: this.$('#card-year-select').val(),
        number: _.trim(this.$('#signup-card-number').val())
      },
      coupon: _.trim(this.$('#signup-coupon-code').val()),
      email: _.trim(this.$('#signup-email').val()),
      method: this.$('#signup-payment-method :checked').val(),
      password1: _.trim(this.$('#signup-password1').val()),
      password2: _.trim(this.$('#signup-password2').val()),
      plan: this.$('#signup-plan').val(),
      username: _.trim(this.$('#signup-username').val()),
      validationCode: _.trim(this.$('#signup-validation-code').val()),
      recaptcha: window.grecaptcha ? window.grecaptcha.getResponse() : null
    };
  },

  getTrialExpirationDate: function() {
    var expiration = moment().add(7, 'days');

    if (this.userReferral) {
      expiration.add(14, 'days');
    }

    return expiration.format('LL');
  },

  /**
   * @method handleChangeSignupPaymentMethod
   * @param {Event} event
   */
  handleChangeSignupPaymentMethod: function(event) {
    event.preventDefault();
    var formData = this.getFormData();
    if (formData.method === 'credit') {
      this.$('#signup-input-coupon').addClass('hidden');
      this.$('#signup-input-credit').removeClass('hidden');
      this.$('#signup-input-credit-expire').removeClass('hidden');
      this.$('#signup-plan').closest('.form-group').removeClass('hidden');
      this.$('#signup-input-school').addClass('hidden');
    } else if (formData.method === 'coupon') {
      this.$('#signup-input-coupon').removeClass('hidden');
      this.$('#signup-input-credit').addClass('hidden');
      this.$('#signup-input-credit-expire').addClass('hidden');
      this.$('#signup-plan').closest('.form-group').addClass('hidden');
      this.$('#signup-input-school').addClass('hidden');
    } else {
      this.$('#signup-input-coupon').addClass('hidden');
      this.$('#signup-input-credit').addClass('hidden');
      this.$('#signup-input-credit-expire').addClass('hidden');
      this.$('#signup-plan').closest('.form-group').addClass('hidden');
      this.$('#signup-input-school').removeClass('hidden');
    }
  },

  /**
   * @method handleClickSignupSubmit
   * @param {Event} event
   */
  handleClickSignupSubmit: function(event) {
    event.preventDefault();
    if (!this.subscribing) {
      this.subscribing = true;
      this.$('#signup-error-alert').addClass('hidden');

      const formData = this.getFormData();

      if (app.isMobile()) {
        this.subscribeAndroid(formData);
        return;
      }

      if (formData.method === 'credit') {
        this.subscribeCredit(formData);
      } else if (formData.method === 'coupon') {
        this.subscribeCoupon(formData);
      } else {
        this.subscribeSchool(formData);
      }
    }
  },

  handleClickValidateSchoolEmail: function(event) {
    const self = this;
    const formData = this.getFormData();

    if (!this._validateEmail(formData.email)) {
      this.displayErrorMessage(app.locale('pages.signup.errorInvalidEmail'));
      this.$('#signup-email').addClass('alert-warning');
      try {
        this.$('#signup-error-alert')[0].scrollIntoView(false);
      } catch(e) {}

      this.subscribing = false;
      ScreenLoader.hide();
      return;
    }

    this.$('#signup-email').removeClass('alert-warning');
    this.$('#signup-error-alert').addClass('hidden');

    async.series([
      function(callback) {
        ScreenLoader.show();
        ScreenLoader.post('Sending validation email');
        self.subscribing = true;
        self.sendValidationEmail(formData.email, callback);
      }
    ], function(error) {
      ScreenLoader.hide();

      if (error) {
        self._handleSubmittedProcessError(error.responseJSON || error);
      } else {
        self.subscribing = false;
        self.$('#validation-sent-address').text(formData.email);
        self.$('#validation-email-sent-msg').removeClass('hidden');
      }
    });
  },

  sendValidationEmail: function(email, callback) {
    const validationUrl = app.getApiUrl() + 'email-validation/send';

    $.ajax({
      url: validationUrl,
      method: 'POST',
      headers: app.user.headers(),
      data: {
        email: email
      },
      success: function() {
        if (_.isFunction(callback)) {
          callback();
        }
      },
      error: function(error) {
        if (_.isFunction(callback)) {
          callback(error);
        }
      }
    });
  },

  /**
   * Given a coupon code,
   * @param {String} couponCode the code to set the input to
   */
  setCouponCode: function(couponCode) {
    this.$('.credit').addClass('hidden');
    this.$('.school').addClass('hidden');
    this.$('.coupon').removeClass('hidden');
    this.$('#signup-coupon-code').val(this.couponCode);
    this.$('#method-credit').prop('checked', false);
    this.$('#method-coupon').prop('checked', true);
  },

  /**
   * @method subscribeAndroid
   * @param {Object} formData
   */
  subscribeAndroid: function(formData) {
    const self = this;

    formData.coupon = 'SKRITTERANDROID'; // use coupon code to bypass signup restriction
    formData.password2 = formData.password1; // skip requiring repeating password input

    if (!this._validateUserData(formData)) {
      this.subscribing = false;
      ScreenLoader.hide();
      return;
    }
    async.series([
      function(callback) {
        ScreenLoader.show();
        ScreenLoader.post('Creating a new user');
        self.createUser(formData, callback);
      }
    ], function(error) {
      ScreenLoader.hide();
      if (error) {
        self._handleSubmittedProcessError(error.responseJSON || error);
      } else {
        self.coupon = null;
        app.removeSetting('coupon');
        self._handleSubmittedProcessSuccess();
      }
    });
  },

  /**
   * @method subscribeCoupon
   * @param {Object} formData
   */
  subscribeCoupon: function(formData) {
    const self = this;

    if (!this._validateUserData(formData)) {
      this.subscribing = false;
      ScreenLoader.hide();
      return;
    }

    async.series([
      function(callback) {
        ScreenLoader.show();
        ScreenLoader.post('Creating a new user');
        self.createUser(formData, callback);
      }
    ], function(error) {
      ScreenLoader.hide();
      if (error) {
        self._handleSubmittedProcessError(error.responseJSON || error);
      } else {
        self.coupon = null;
        app.removeSetting('coupon');
        self._handleSubmittedProcessSuccess();
      }
    });
  },

  /**
   * @method subscribeCredit
   * @param {Object} formData
   */
  subscribeCredit: function(formData) {
    const self = this;

    if (!this._validateUserData(formData)) {
      this.subscribing = false;
      ScreenLoader.hide();
      return;
    }

    async.series([
      function(callback) {
        ScreenLoader.show();
        if (window.Stripe) {
          callback();
        } else {
          ScreenLoader.post('Creating a stripe token');
          $.getScript('https://js.stripe.com/v2/', callback);
        }
      },
      function(callback) {
        Stripe.setPublishableKey(app.getStripeKey());
        Stripe.card.createToken(
          {
            exp_month: formData.card.expires_month,
            exp_year: formData.card.expires_year,
            number: formData.card.number
          },
          function(status, response) {
            if (response.error) {
              callback(response.error);
            } else {
              formData.token = response.id;
              callback();
            }
          }
        );
      },
      function(callback) {
        ScreenLoader.post('Creating a new user');
        self.createUser(formData, callback);
      }
    ], function(error) {
      ScreenLoader.hide();
      if (error) {
        self._handleSubmittedProcessError(error.responseJSON || error);
      } else {
        self._handleSubmittedProcessSuccess();
      }
    });
  },

  /**
   * Subscribes a user using a school subscription.
   * @param {object} formData the submitted data
   */
  subscribeSchool: function(formData) {
    var self = this;

    if (!this._validateUserData(formData)) {
      this.subscribing = false;
      ScreenLoader.hide();
      return;
    }

    async.series([
      function(callback) {
        ScreenLoader.show();
        ScreenLoader.post('Creating a new user');
        self.createUser(formData, callback);
      }
    ], function(error) {
      ScreenLoader.hide();
      if (error) {
        self._handleSubmittedProcessError(error.responseJSON || error);
      } else {
        self._handleSubmittedProcessSuccess();
      }
    });
  },

  /**
   * Responds to an error during the data submission process of user creation
   * and updates the UI accordingly.
   * @param {Object} error the error object to handle
   * @todo Unhack
   * @private
   */
  _handleSubmittedProcessError: function(error) {

    // Let the user actually subscribe again when submitting the form
    this.subscribing = false;

    // For when the error is a jQuery XHR object, we just want the plain error object
    if (_.isFunction(error.error)) {
      error = error.responseJSON;
    }

    // stripe errors
    if (error.code === 'invalid_expiry_month' ||
      error.code === 'invalid_expiry_year' ||
      error.code === 'incorrect_number') {
      this.displayErrorMessage(error.message);
      return;
    }

    var errorMsg = app.locale('pages.signup.errorDefault');

    // user API errors
    if (error.statusCode === 404) {
      if (error.message === "Coupon not found.") {
        errorMsg = app.locale('pages.signup.errorCouponInvalid');
      }
    }

    if (error.statusCode === 400) {
      switch(error.message) {
        case "Another user is already using that display name.":
          errorMsg = app.locale('pages.signup.errorDuplicateUsername').replace('#{username}', this.user.get('name'));
          break;
        case "This coupon is expired.":
          errorMsg = app.locale('pages.signup.errorCouponExpired');
          break;
        case "Code has already been used.":
          errorMsg = app.locale('pages.signup.errorCouponAlreadyUsed');
          break;
        case "Coupon is not ready for use. Try again later.":
          errorMsg = app.locale('pages.signup.errorCouponNotReady');
          break;
        case "This code has been exhausted.":
          errorMsg = app.locale('pages.signup.errorCouponExhausted');
          break;
        case "The email entered has already been used.":
          errorMsg = app.locale('pages.signup.errorSchoolEmailAlreadyUsed');
          break;
        case "School validation cannot add time to this account.":
          errorMsg = app.locale('pages.signup.errorSchoolCantAddTime');
          break;
        case "The email entered is not an eligible email.":
          errorMsg = app.locale('pages.signup.errorNotSchoolEmail');
          break;
        case "Invalid code entered.":
          errorMsg = app.locale('pages.signup.errorInvalidEmailValidationCode');
          break;
        case 'Property "name" must be no longer than 20 characters long.':
          errorMsg = app.locale('pages.signup.errorUsernameTooLong');
          break;
        case 'Property "password" must be no longer than 20 characters long.':
          errorMsg = app.locale('pages.signup.errorPasswordLengthTooLong');
          break;
        case "InvalidValidationCode":
          errorMsg = app.locale('pages.signup.errorInvalidEmailValidationCode');
          break;
        case "NoValidationCode":
          errorMsg = app.locale('pages.signup.errorValidationCodeNotEntered');
          break;
        case "IneligibleSchoolEmail":
          errorMsg = app.locale('pages.signup.errorNotSchoolEmail');
          break;
        case "EmailTaken":
          errorMsg = app.locale('pages.signup.errorEmailTaken');
          break;
        default:
          errorMsg = app.locale('pages.signup.errorDefault');
      }
    }

    this.displayErrorMessage(errorMsg);
  },

  /**
   * Responds to a successful account registration process
   * @private
   */
  _handleSubmittedProcessSuccess: function() {
    if (app.isMobile()) {
      app.router.navigate('vocablists/browse');
      app.reload();
      return;
    }

    app.router.navigate('account/setup', {trigger: true});
  },

  /**
   * Processes a valid user referral.
   * @param {Function} callback called when the process is complete
   * @private
   */
  _processUserReferral: function(callback) {
    var dfd = app.processUserReferral(true);
    var siteRef = app.getRefererId();

    // affiliate referrals take priority over user referrals,
    // only process 1 of them.
    if (dfd && !siteRef) {
      dfd.done(function(subscription) {
        callback();
      })
        .fail(function(error) {
          app.notifyUser({
            message: app.locale('common.errorUserReferralFailed')
          });
          callback();
        });
    } else {

      // no user referral to process
      callback();
    }
  },

  /**
   * Saves a new user to the server and marks it as new to the frontend code.
   * Updates the screenloader with progress
   * @param {Function} callback called when the user is saved
   * @private
   */
  _saveNewUser: function(callback) {
    ScreenLoader.post('Creating new user');
    this.user.isNewUser = true;
    this.user.save(
      null,
      {
        error: function(user, error) {
          callback(error);
        },
        success: function(user) {
          app.removeSetting('siteRef');
          callback();
        }
      }
    );
  },

  _validateEmail: function(email) {
    var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return (!_.isEmpty(email) && email.match(emailRegex));
  },

  /**
   * Validates submitted user form data to check if it conforms to submission
   * rules. Displays an error message to the user if any part of the data is
   * invalid.
   * @param {Object} formData dictionary of values to check
   * @return {Boolean} whether the data can be submitted
   */
  _validateUserData: function(formData) {
    if (_.isEmpty(formData.username)) {
      this.displayErrorMessage(app.locale('pages.signup.errorNoUsername'));
      return false;
    }

    if (!this._validateEmail(formData.email)) {
      this.displayErrorMessage(app.locale('pages.signup.errorInvalidEmail'));
      return false;
    }

    if (formData.password1 !== formData.password2 ||
      _.isEmpty(formData.password1)) {
      this.displayErrorMessage(app.locale('pages.signup.errorInvalidPasswords'));
      return false;
    }

    if (formData.password1.length < 6) {
      this.displayErrorMessage(app.locale('pages.signup.errorInvalidPasswordLength'));
      return false;
    }

    if (formData.password1.length > 256) {
      this.displayErrorMessage(app.locale('pages.signup.errorInvalidPasswordLengthTooLong'));
      return false;
    }

    if (!formData.recaptcha && !app.isCordova() && !app.isDevelopment()) {
      this.displayErrorMessage(app.locale('pages.signup.errorInvalidRecaptcha'));
      return false;
    }

    if (formData.method === 'credit') {
      var cardYear = formData.card.expires_year;
      var cardMonth = formData.card.expires_month;
      var cardNumber = formData.card.number;
      var ccRegexp = /^[0-9]+$/;
      if (!cardNumber) {
        this.displayErrorMessage(app.locale('pages.signup.errorNoCCNmber'));
        return false;
      }

      if (cardNumber.length < 13 || cardNumber.length > 19 || !ccRegexp.test(cardNumber)) {
        this.displayErrorMessage(app.locale('pages.signup.errorInvalidCCNumber'));
        return false;
      }

      if (moment(cardMonth + '-' + cardYear, 'MM-YYYY').diff(moment(), 'months') < 0) {
        this.displayErrorMessage(app.locale('pages.signup.errorCCExpired'));
        return false;
      }
    }

    if (formData.method === 'coupon') {
      if (_.isEmpty(formData.coupon)) {
        this.displayErrorMessage(app.locale('pages.signup.errorCouponNotEntered'));
        return false;
      }
    } else {
      delete formData.coupon;
    }

    if (formData.method === 'school') {
      if (_.isEmpty(formData.validationCode)) {
        this.displayErrorMessage(app.locale('pages.signup.errorValidationCodeNotEntered'));
        return false;
      }
    } else {
      delete formData.validationCode;
    }

    return true;
  }

});
