var GelatoPage = require('gelato/page');

var MarketingFooter = require('components/marketing/footer/view');
var User = require('models/user');
var DefaultNavbar = require('navbars/default/view');

/**
 * @class Signup
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.footer = new MarketingFooter();
        this.navbar = new DefaultNavbar();
        this.plan = options.plan;
        this.user = new User();
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
     * @property products
     * @type {Array}
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
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
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
        return this;
    },
    /**
     * @method createUser
     * @param {Object} formData
     * @param {Function} callback
     */
    createUser: function(formData, callback) {
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
        this.user.save(
            null,
            {
                error: function(error) {
                    callback(error);
                },
                success: function() {
                    callback();
                }
            }
        )
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
                number: this.$('#signup-card-number').val()
            },
            coupon: this.$('#signup-coupon-code').val(),
            email: this.$('#signup-email').val(),
            method: this.$('#signup-payment-method :checked').val(),
            password1: this.$('#signup-password1').val(),
            password2: this.$('#signup-password2').val(),
            plan: this.$('#signup-plan').val(),
            username: this.$('#signup-username').val()
        };
    },
    /**
     * @method handleChangeSignupPaymentMethod
     * @param {Event} event
     */
    handleChangeSignupPaymentMethod: function(event) {
        event.preventDefault();
        var formData= this.getFormData();
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
        async.series([
            function(callback) {
                ScreenLoader.show();
                ScreenLoader.post('Creating a new user');
                self.createUser(formData, callback);
            },
            function(callback) {
                ScreenLoader.post('Logging in new user');
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
                ScreenLoader.post('Sending welcome email');
                $.ajax({
                    method: 'GET',
                    url: 'https://api-dot-write-way.appspot.com/v1/email/welcome',
                    data: {
                        token: app.user.session.get('access_token')
                    },
                    error: function(error) {
                        callback(error);
                    },
                    success: function() {
                        callback()
                    }
                });
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
                        number: formData.card.number,
                        exp_month: formData.card.expires_month,
                        exp_year: formData.card.expires_year
                    },
                    function(status, response) {
                        if (response.error) {
                            callback(response.error.message);
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
            },
            function(callback) {
                ScreenLoader.post('Logging in new user');
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
                ScreenLoader.post('Sending welcome email');
                $.ajax({
                    method: 'GET',
                    url: 'https://api-dot-write-way.appspot.com/v1/email/welcome',
                    data: {
                        token: app.user.session.get('access_token')
                    },
                    error: function(error) {
                        callback(error);
                    },
                    success: function() {
                        callback()
                    }
                });
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
    }
});
