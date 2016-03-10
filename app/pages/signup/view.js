var GelatoPage = require('gelato/page');

var MarketingFooter = require('components/marketing/footer/view');
var User = require('models/user');
var DefaultNavbar = require('navbars/default/view');

/**
 * A page that allows a user to create account for Skritter by entering
 * user credentials, subscription options, and payment information.
 * @class Signup
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

    /**
     * Creates a new Signup View.
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.footer = new MarketingFooter();
        this.navbar = new DefaultNavbar();
        this.plan = options.plan;
        this.user = new User();
        mixpanel.track('Viewed signup page');
    },

    /**
     * @property events
     * @type Object
     */
    events: {
        'change #signup-payment-method': 'handleChangeSignupPaymentMethod',
        'vclick #signup-submit': 'handleClickSignupSubmit'
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
    template: require('./template'),

    /**
     * The page title to display
     * @type {String}
     */
    title: 'Signup - Skritter',

    /**
     * @method render
     * @returns {Signup}
     */
    render: function() {
        this.renderTemplate();
        this.footer.setElement('#footer-container').render();
        this.navbar.setElement('#navbar-container').render();
        if (app.isDevelopment()) {
            this.$('#signup-username').val('tester1');
            this.$('#signup-email').val('josh@skritter.com');
            this.$('#signup-password1').val('skrit123');
            this.$('#signup-password2').val('skrit123');
            this.$('#signup-card-number').val('4242424242424242');
            this.$('#card-year-select').val(new Date().getFullYear() + 1);
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

        this.user.set({
            email: formData.email,
            name: formData.username,
            password: formData.password1
        });
        if (formData.method === 'credit') {
            this.user.set({
                plan: formData.plan,
                token: formData.token
            });
        } else {
            this.user.set('couponCode', formData.coupon);
        }
        if (app.isDevelopment()) {
            this.user.unset('avatar');
        }
        async.series([
            function(callback) {
                ScreenLoader.post('Creating new user');
                self.user.save(
                    null,
                    {
                        error: function(user, error) {
                            callback(error);
                        },
                        success: function(user) {
                            mixpanel.alias(user.id);
                            mixpanel.track(
                                'Signup',
                                {
                                    method: formData.method,
                                    plan: formData.plan
                                },
                                function() {
                                    callback();
                                }
                            );
                        }
                    }
                )
            },
            function(callback) {
                app.user.login(
                    formData.username,
                    formData.password1,
                    function(error) {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    }
                )
            },
            function(callback) {
                if (app.isProduction()) {
                    ScreenLoader.post('Sending welcome email');
                    $.ajax({
                        method: 'GET',
                        url: 'https://api-dot-write-way.appspot.com/v1/email/welcome',
                        data: {
                            client: 'website',
                            token: app.user.session.get('access_token')
                        },
                        error: function(error) {
                            callback(error);
                        },
                        success: function() {
                            callback()
                        }
                    });
                } else {
                    callback();
                }
            }
        ], callback);
    },

    /**
     * Displays an error messsage about the form data to the user
     * @param {String} message the error to show to the user
     */
    displayErrorMessage: function(message) {
        this.$('#signup-error-alert').text(message).removeClass('hide');
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
            username: _.trim(this.$('#signup-username').val())
        };
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
        } else {
            this.$('#signup-input-coupon').removeClass('hidden');
            this.$('#signup-input-credit').addClass('hidden');
            this.$('#signup-input-credit-expire').addClass('hidden');
            this.$('#signup-plan').closest('.form-group').addClass('hidden');
        }
    },

    /**
     * @method handleClickSignupSubmit
     * @param {Event} event
     */
    handleClickSignupSubmit: function(event) {
        event.preventDefault();
        var formData = this.getFormData();
        if (formData.password1 === '') {
            return;
        }
        if (formData.password1 !== formData.password2) {
            return;
        }
        if (formData.method === 'credit') {
            this.subscribeCredit(formData);
        } else {
            this.subscribeCoupon(formData);
        }
    },

    /**
     * @method remove
     * @returns {Signup}
     */
    remove: function() {
        this.navbar.remove();
        this.footer.remove();
        return GelatoPage.prototype.remove.call(this);
    },

    /**
     * @method subscribeCoupon
     * @param {Object} formData
     */
    subscribeCoupon: function(formData) {
        var self = this;

        if (!this._validateUserData(formData)) {
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
            if (error) {
                ScreenLoader.hide();
                console.error(error);
            } else {
                app.router.navigate('dashboard');
                app.reload();
            }
        });
    },

    /**
     * @method subscribeCredit
     * @param {Object} formData
     */
    subscribeCredit: function(formData) {
        var self = this;

        if (!this._validateUserData(formData)) {
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
                self._handleSubmittedProcessError(error);
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

        // For when the error is a jQuery XHR object, we just want the plain error object
        if (_.isFunction(error.error)) {
            error = error.responseJSON;
        }

        console.error(error.message);

        // stripe errors
        if (error.code === 'invalid_expiry_month' ||
            error.code === 'invalid_expiry_year' ||
            error.code === 'incorrect_number') {
            this.displayErrorMessage(error.message);
        }

        // user API errors
        if (error.statusCode === 400) {
            if (error.message === "Another user is already using that display name.") {
                this.displayErrorMessage("Another person has taken the username " + this.user.get('name') + ". Please choose another one.");
            }
        }
    },

    /**
     * Responds to a successful account registration process
     * @private
     */
    _handleSubmittedProcessSuccess: function() {
        app.router.navigate('account/setup', {trigger: true});
    },

    /**
     * Validates submitted user form data to check if it conforms to submission
     * rules. Displays an error message to the user if any part of the data is
     * invalid.
     * @param {Object} formData dictionary of values to check
     * @return {Boolean} whether the data can be submitted
     */
    _validateUserData: function(formData) {
        var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (_.isEmpty(formData.username)) {
            this.displayErrorMessage('Invalid username entered.');
            return false;
        }

        if (_.isEmpty(formData.email) || !formData.email.match(emailRegex)) {
            this.displayErrorMessage('Invalid email address entered.');
            return false;
        }

        // TODO: find serverside validation setting for password length
        if (formData.password1 !== formData.password2 ||
            _.isEmpty(formData.password1)) {
            this.displayErrorMessage('Invalid password entered or passwords don\'t match');
            return false;
        }

        if (formData.password1.length < 6) {
            this.displayErrorMessage('Password length must be 6 characters or longer.');
            return false;
        }

        return true;
    }
});
