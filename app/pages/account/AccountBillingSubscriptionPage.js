const GelatoPage = require('gelato/page');
const AccountSidebar = require('components/account/AccountSidebarComponent');
const Coupon = require('models/CouponModel');
const Subscription = require('models/SubscriptionModel');
const StripeLoader = require('utils/stripe-loader');

const CancelSubscriptionDialog = require('dialogs/cancel-subscription/view');
const VacationDialog = require('dialogs/vacation/view');

/**
 * @class AccountBillingSubscriptionPage
 * @extends {GelatoPage}
 */
const AccountBillingSubscriptionPage = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'change input[name="payment-method"]': 'handleChangePaymentMethod',
    'click #redeem-code-btn': 'handleClickRedeemCodeButton',
    'click #go-on-vacation-link': 'handleClickGoOnVacationLink',
    'click #cancel-vacation-link': 'handleClickCancelVacationLink',
    'click #unsubscribe-itunes-btn': 'handleClickUnsubscribeITunesButton',
    'click #subscribe-stripe-btn': 'handleClickSubscribeStripeButton',
    'click #update-stripe-subscription-btn': 'handleClickUpdateStripeSubscriptionButton',
    'click .spoof-button-area button': 'handleClickSpoofButtonAreaButton',
    'click #unsubscribe-btn': 'handleClickUnsubscribeButton',
    'click #subscribe-paypal-btn': 'handleClickSubscribePaypalButton',
    'click #send-validation-email-btn': 'handleClickValidationEmailButton',
    'click #update-school-subscription-btn': 'handleClickSubscribeSchoolButton',
    'click .restore-android': 'handleClickRestoreAndroid',
    'click .subscribe-android': 'handleClickSubscribeAndroid',
  },

  /**
   * @property paypalPlans
   * @type {Array}
   */
  paypalPlans: [
    {
      key: 'Month Plan',
      fullName: 'Month Plan : $14.99 USD - monthly',
    },
    {
      key: 'Year Plan',
      fullName: 'Year Plan : $99.99 USD - yearly',
    },
  ],

  /**
   * @property template
   * @type {Function}
   */
  template: require('./AccountBillingSubscription'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Billing - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    StripeLoader.load();

    this.coupon = new Coupon({code: app.getStoredCouponCode() || ''});
    this._views['sidebar'] = new AccountSidebar();
    this.subscription = new Subscription({id: app.user.id});

    this.listenTo(this.subscription, 'state', this.render);
    this.listenTo(this.coupon, 'state', this.render);
    this.listenTo(this.coupon, 'sync', function (model, response) {
      this.subscription.set(response.Subscription);
      this.coupon.unset('code');
    });

    this.subscription.fetch();
  },

  /**
   * @method render
   * @returns {AccountBillingSubscriptionPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileAccountBillingSubscription.jade');
    }

    this.renderTemplate();
    this._views['sidebar'].setElement('#sidebar-container').render();

    return this;
  },

  /**
   * @method handleChangePaymentMethod
   */
  handleChangePaymentMethod: function () {
    let method = this.$('input[name="payment-method"]:checked').val();
    this.$('.credit-card-form-group').toggleClass('hide', method !== 'stripe');
    this.$('.paypal-form-group').toggleClass('hide', method !== 'paypal');
    this.$('.school-form-group').toggleClass('hide', method !== 'school');
  },

  /**
   * @method handleClickCancelVacationLink
   */
  handleClickCancelVacationLink: function () {
    this.subscription.save({vacation: false}, {
      parse: true,
      method: 'PUT',
    });

    this.$('#cancel-vacation-spinner').removeClass('hide');
    this.$('#cancel-vacation-link').addClass('hide');
  },

  /**
   * @method handleClickGoOnVacationLink
   */
  handleClickGoOnVacationLink: function () {
    this.openVacationDialog();
  },

  /**
   * @method handleClickRedeemCodeButton
   */
  handleClickRedeemCodeButton: function () {
    this.coupon.set('code', this.$('#code-input').val());
    this.coupon.use();
    this.render();
  },

  /**
   * @method handleClickSpoofButtonAreaButton
   * @param {Event} event
   */
  handleClickSpoofButtonAreaButton: function (event) {
    let subscribed = $(event.target).data('subscribed');
    let client = $(event.target).data('client');
    let discount = $(event.target).data('discount');
    let vacation = $(event.target).data('vacation');
    if (subscribed) {
      // reset first
      this.subscription.set({
        subscribed: false,
        ios: false,
        gplay: false,
        stripe: false,
        anet: false,
        paypal: false,
      });
      if (subscribed === 'ios') {
        this.subscription.set({
          subscribed: 'ios',
          ios: {
            'localizedPrice': '£9.99 (localized price test)',
          },
        });
      }
      if (subscribed === 'gplay') {
        this.subscription.set({
          subscribed: 'gplay',
          gplay: {
            'subscription': 'one.month.sub',
            'token': '-- gplay token id --',
            'package': 'com.inkren.skritter.chinese',
          },
        });
      }
      if (subscribed === 'paypal') {
        this.subscription.set({
          subscribed: 'paypal',
          paypal: {
            'plan': 'Month Plan',
          },
        });
      }
      if (subscribed === 'stripe') {
        this.subscription.set({
          subscribed: 'stripe',
          stripe: {
            plan: 'one_month',
            cardNumber: '1234',
            price: '9.99',
            months: 1,
            discount: false,
          },
        });
      }
      if (subscribed === 'anet') {
        this.subscription.set({
          subscribed: 'anet',
          stripe: {
            plan: 'one_month',
            cardNumber: '1234',
            price: '9.99',
            months: 1,
            discount: false,
          },
        });
      }
    }
    if (client) {
      if (client === 'site') {
        app.isWebsite = function () {
          return true;
        };
        app.isMobile = function () {
          return false;
        };
        app.isAndroid = function () {
          return false;
        };
        app.isIOS = function () {
          return false;
        };
      }
      if (client === 'ios') {
        app.isWebsite = function () {
          return false;
        };
        app.isMobile = function () {
          return true;
        };
        app.isAndroid = function () {
          return false;
        };
        app.isIOS = function () {
          return true;
        };
      }
      if (client === 'android') {
        app.isWebsite = function () {
          return false;
        };
        app.isMobile = function () {
          return true;
        };
        app.isAndroid = function () {
          return true;
        };
        app.isIOS = function () {
          return false;
        };
      }
    }
    if (discount) {
      if (discount === 'on') {
        this.subscription.set({
          discount: {
            price: 4.99,
            expires: '2020-01-01',
          },
          availablePlans: [{
            'name': '1 month',
            'price': '4.99',
            'months': 1,
            'discount': true,
            'key': 'one_month',
            'fullName': '$4.99/month (discount)',
          }],
        });
      }
      if (discount === 'off') {
        this.subscription.set({
          discount: false,
          availablePlans: [{
            'name': '1 month',
            'price': '14.99',
            'months': 1,
            'discount': true,
            'key': 'one_month',
            'fullName': '$14.99/month',
          }],
        });
      }
    }
    if (vacation) {
      if (vacation === 'on') {
        this.subscription.set({
          vacation: {
            start: moment().subtract('1', 'month').format('YYYY-MM-DD'),
            end: moment().add('1', 'month').format('YYYY-MM-DD'),
          },
        });
      }
      if (vacation === 'off') {
        this.subscription.set({vacation: false});
      }
    }
    $(event.target).closest('.list-group').find('button').removeClass('active');
    $(event.target).closest('button').addClass('active');
    this.render();
  },

  /**
   * @method handleClickSubscribePaypalButton
   */
  handleClickSubscribePaypalButton: function () {
    let plan = this.$('#paypal-plan-select').val();
    this.$('#paypal-subscribe-select').val(plan);
    this.$('#paypal-subscribe-form').submit();
  },

  /**
   * @method handleClickSubscribeSchoolButton
   */
  handleClickSubscribeSchoolButton: function () {
    let self = this;
    let validationCode = this.$('#signup-validation-code').val().trim();
    let data = {
      email: app.user.get('email'),
      code: validationCode,
    };

    if (!validationCode) {
      this._displayValidationErrorMessage(app.locale('pages.signup.errorValidationCodeNotEntered'));
      return;
    }

    this.$('#update-school-subscription-btn span').addClass('hide');
    this.$('#update-school-subscription-btn i').removeClass('hide');
    $.ajax({
      url: app.getApiUrl() + 'email-validation/use',
      headers: app.user.session.getHeaders(),
      method: 'POST',
      data: data,
      context: this,
      success: function (response) {
        app.mixpanel.track(
          'Subscribe',
          {
            'Method': 'school',
          }
        );
        self.subscription.set(response.Subscription);
        self.render();
      },
      error: function (response) {
        self._handleValidationError(response);
        self.$('#update-school-subscription-btn span').removeClass('hide');
        self.$('#update-school-subscription-btn i').addClass('hide');
      },
    });
  },

  /**
   * @method handleClickSubscribeStripeButton
   */
  handleClickSubscribeStripeButton: function () {
    let cardData = {
      number: this.$('#card-number-input').val(),
      exp_month: this.$('#card-month-select').val(),
      exp_year: this.$('#card-year-select').val(),
    };
    let handler = _.bind(this.handleClickSubscribeStripeButtonResponse, this);
    Stripe.setPublishableKey(app.getStripeKey());
    Stripe.card.createToken(cardData, handler);
    this.setSubscribeStripeButtonDisabled(true);
    this.$('#card-error-alert').addClass('hide');
  },

  /**
   * @method this.handleClickSubscribeStripeButtonResponse
   */
  handleClickSubscribeStripeButtonResponse: function (status, response) {
    if (response.error) {
      this.setSubscribeStripeButtonDisabled(false);
      this.$('#card-error-alert')
        .text(response.error.message)
        .removeClass('hide');
    } else {
      let token = response.id;
      let url = app.getApiUrl() + this.subscription.url() + '/stripe/subscribe';
      let headers = app.user.session.getHeaders();
      let self = this;
      let data = {
        token: token,
        plan: this.$('#plan-select').val(),
      };
      $.ajax({
        url: url,
        headers: headers,
        method: 'POST',
        data: data,
        context: this,
        success: function (response) {
          app.mixpanel.track(
            'Subscribe',
            {
              'Method': 'credit',
              'Plan': data.plan,
            }
          );
          self.subscription.set(response.Subscription);
          self.render();
        },
      });
    }
  },

  /**
   * @method handleClickUnsubscribeButton
   */
  handleClickUnsubscribeButton: function () {
    let dialog = new CancelSubscriptionDialog({
      subscription: this.subscription,
    });
    dialog.render().open();
    this.listenToOnce(dialog, 'hidden', function () {
      if (dialog.choseVacation) {
        let open = _.bind(this.openVacationDialog, this);
        _.delay(open, 200);
      }
    });
  },

  /**
   * @method handleClickUnsubscribeITunesButton
   */
  handleClickUnsubscribeITunesButton: function () {
    let url = app.getApiUrl() + this.subscription.url() + '/ios/cancel';
    let headers = app.user.session.getHeaders();
    let self = this;

    this.$('#unsubscribe-itunes-btn *').toggleClass('hide');
    $.ajax({
      url: url,
      headers: headers,
      method: 'POST',
      context: this,
      success: function (response) {
        self.subscription.set(response.Subscription);
        self.render();
      },
    });
  },

  /**
   * @method handleClickUpdateStripeSubscriptionButton
   */
  handleClickUpdateStripeSubscriptionButton: function () {
    let cardData = {
      number: this.$('#card-number-input').val(),
      exp_month: this.$('#card-month-select').val(),
      exp_year: this.$('#card-year-select').val(),
    };

    if (cardData.number) {
      let handler = _.bind(this.handleClickUpdateStripeSubscriptionButtonResponse, this);
      Stripe.setPublishableKey(app.getStripeKey());
      Stripe.card.createToken(cardData, handler);
      this.setSubscribeStripeButtonDisabled(true);
    } else {
      let url = (app.getApiUrl() + this.subscription.url() + '/stripe');
      let headers = app.user.session.getHeaders();
      let data = {plan: this.$('#plan-select').val()};
      let self = this;
      $.ajax({
        url: url,
        headers: headers,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        context: this,
        success: function (response) {
          self.subscription.set(response.Subscription);
          self.render();
        },
        error: function (response) {
          self.setSubscribeStripeButtonDisabled(false);
          self.$('#card-error-alert')
            .text(response.error.message)
            .removeClass('hide');
        },
      });

      this.setSubscribeStripeButtonDisabled(true);
    }

    this.$('#card-error-alert').addClass('hide');
  },

  /**
   * @method handleClickSubscribeStripeButtonResponse
   */
  handleClickUpdateStripeSubscriptionButtonResponse: function (status, response) {
    if (response.error) {
      this.setSubscribeStripeButtonDisabled(false);
      this.$('#card-error-alert')
        .text(response.error.message)
        .removeClass('hide');
    } else {
      let self = this;
      let token = response.id;
      let url = (app.getApiUrl() + this.subscription.url() + '/stripe');
      let headers = app.user.session.getHeaders();
      let data = {
        token: token,
        plan: this.$('#plan-select').val(),
      };

      $.ajax({
        url: url,
        headers: headers,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        context: this,
        success: function (response) {
          self.subscription.set(response.Subscription);
          self.render();
        },
      });
    }
  },

  /**
   * @method handleClickValidationEmailButton
   */
  handleClickValidationEmailButton: function () {
    let self = this;
    let email = this.$('#school-validation-email').val().trim();

    if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 2) {
      this._displayValidationErrorMessage(app.locale('pages.signup.errorInvalidEmail'));
      return;
    }

    this.$('#validation-error-alert').addClass('hide');

    this.$('#send-validation-email-btn').addClass('hide');
    this.$('#sending-validation-email-notice').removeClass('hide');

    async.series([
      function (callback) {
        self.sendValidationEmail(email, callback);
      },
    ], function (error) {
      self.$('#send-validation-email-btn').removeClass('hide');
      self.$('#sending-validation-email-notice').addClass('hide');

      if (error) {
        self._handleValidationError(error);
      } else {
        self.$('#validation-sent-address').text(email);
        self.$('#validation-email-sent-msg').removeClass('hidden');
      }
    });
  },

  /**
   * Attempts to send a school validation email to the specified email address
   * @param {String} email the email address to send to
   * @param {Function} callback called when the email has been sent
   */
  sendValidationEmail: function (email, callback) {
    let validationUrl = app.getApiUrl() + 'email-validation/send';

    $.ajax({
      url: validationUrl,
      method: 'POST',
      headers: app.user.headers(),
      data: {
        email: email,
      },
      success: function () {
        if (_.isFunction(callback)) {
          callback();
        }
      },
      error: function (error) {
        if (_.isFunction(callback)) {
          callback(error);
        }
      },
    });
  },

  /**
   * @method openVacationDialog
   */
  openVacationDialog: function () {
    let dialog = new VacationDialog({subscription: this.subscription});
    dialog.render().open();
  },

  /**
   * @method setSubscribeStripeButtonDisabled
   * @param {Boolean} disabled
   */
  setSubscribeStripeButtonDisabled: function (disabled) {
    let button = this.$('#update-stripe-subscription-btn, #subscribe-stripe-btn');
    button.attr('disabled', disabled);
    button.find('span').toggleClass('hide', disabled);
    button.find('i').toggleClass('hide', !disabled);
  },

  handleClickRestoreAndroid: function (event) {
    // let $element = $(event.target);

    if (app.isAndroid()) {
      app.user.subscription.restoreSubscription();
    }
  },

  handleClickSubscribeAndroid: function (event) {
    let $element = $(event.target);
    let type = $element.data('type');

    if (app.isAndroid()) {
      plugins.billing.makePurchase(type, 'subs')
        .then(
          function (sub) {
            if (sub && sub.orderId) {
              app.user.subscription.set('gplay_subscription', {
                  subscription: sub.productId,
                  package: sub.packageName,
                  token: sub.purchaseToken,
              });

              app.user.subscription.save();
            }
          }
        );
    }
  },

  _handleValidationError: function (error) {
    // For when the error is a jQuery XHR object, we just want the plain error object
    if (_.isFunction(error.error)) {
      error = error.responseJSON;
    }

    let errorMsg = app.locale('pages.signup.errorDefault');
    if (error.statusCode === 400) {
      switch (error.message) {
        case 'This code has been exhausted.':
          errorMsg = app.locale('pages.signup.errorCouponExhausted');
          break;
        case 'The email entered has already been used.':
          errorMsg = app.locale('pages.signup.errorSchoolEmailAlreadyUsed');
          break;
        case 'School validation cannot add time to this account.':
          errorMsg = app.locale('pages.signup.errorSchoolCantAddTime');
          break;
        case 'The email entered is not an eligible email.':
          errorMsg = app.locale('pages.signup.errorNotSchoolEmail');
          break;
        case 'Invalid code entered.':
          errorMsg = app.locale('pages.signup.errorInvalidEmailValidationCode');
          break;
        case '<email> is not in params: {u\'email\': u\'\'}':
          errorMsg = app.locale('pages.signup.errorInvalidEmail');
          break;
        default:
          errorMsg = app.locale('pages.signup.errorDefault');
      }
    }

    this._displayValidationErrorMessage(errorMsg);
  },

  _displayValidationErrorMessage: function (message) {
    this.$('#validation-error-alert').text(message).removeClass('hide');
  },

});

module.exports = AccountBillingSubscriptionPage;
