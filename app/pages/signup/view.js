var GelatoPage = require('gelato/page');
var MarketingFooter = require('components/marketing-footer/view');
var StripeLoader = require('utils/stripe-loader');
var User = require('models/user');
var Session = require('models/session');

// TODO:
// * lookup username on username field change
// * check password match on confirm password field change
// * allow signup with coupon
// * allow signup with school validation

/**
 * @class Signup
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        StripeLoader.load();
        this.footer = new MarketingFooter();
        this.navbar = this.createComponent('navbars/marketing');
        this.user = null;
        this.password = null;
        this.session = new Session();
        this.session.authenticate('client_credentials', null, null, _.noop, _.noop);
    },
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background2',
    /**
     * @property events
     * @type Object
     */
    events: {
        'submit form': 'handleSubmitForm',
        'change input[name="payment-method"]': 'handleChangePaymentMethod'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Signup - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
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
     * @method remove
     * @returns {Signup}
     */
    remove: function() {
        this.navbar.remove();
        this.footer.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method createUser
     * @param {object} attrs
     */
    createUser: function(attrs) {
        attrs = attrs || {};
        this.username = this.$('#signup-username').val();
        this.password = this.$('#signup-password1').val();
        _.extend(attrs, {
            'name': this.username,
            'password': this.password,
            'email': this.$('#signup-email').val(),
            'plan': this.$('#signup-plan').val()
        });
        var user = new User(attrs);
        user.headers = this.session.getHeaders();
        user.save();
        this.listenToOnce(user, 'sync', this.createUserSync);
        this.listenToOnce(user, 'error', this.createUserError);
    },
    /**
     * @method createUserError
     */
    createUserError: function(user, jqxhr) {
        this.setSignupSubmitButtonDisabled(false);
        this.setSignupErrorAlertMessage(jqxhr.responseJSON.message);
    },
    /**
     * @method createUserSync
     */
    createUserSync: function() {
        app.user.login(this.username, this.password, function() {
            app.router.navigate('dashboard', {trigger: false});
            app.reload();
        }, _.bind(function(error) {
            this.setSignupSubmitButtonDisabled(false);
            this.setSignupErrorAlertMessage(error.responseJSON.message);
        }, this));
    },
    /**
     * @method handleChangePaymentMethod
     */
    handleChangePaymentMethod: function() {
        var value = $('input[name="payment-method"]:checked').val();
        this.$('.form-group.credit').toggleClass('hide', value !== 'credit');
        this.$('.form-group.coupon').toggleClass('hide', value !== 'coupon');
    },
    /**
     * @method handleSubmitForm
     * @param {Event} event
     */
    handleSubmitForm: function(event) {
        event.preventDefault();
        this.$('.form-group').removeClass('has-error');
        var inputs = this.$('input:visible');
        var allFilledIn = _.all(inputs, function(el) { return $(el).val(); });
        if (!allFilledIn) {
            this.setSignupErrorAlertMessage('Please fill in all fields.');
            _.forEach(inputs, function(el) {
                if (!$(el).val()) {
                    $(el).closest('.form-group').addClass('has-error');
                }
            })
            return;
        }
        if (this.$('#signup-password1').val() !== this.$('#signup-password2').val()) {
            this.setSignupErrorAlertMessage('Passwords do not match.');
            this.$('#signup-password1, #signup-password2')
              .closest('.form-group')
              .addClass('has-error');
            return;
        }

        var value = this.$('input[name="payment-method"]:checked').val();
        if (value === 'credit') {
            var cardData = {
                number: this.$('#signup-card-number').val(),
                exp_month: this.$('#card-month-select').val(),
                exp_year: this.$('#card-year-select').val()
            };
            var handler = _.bind(this.handleSubmitFormStripeResponse, this);
            Stripe.setPublishableKey(app.getStripeKey());
            Stripe.card.createToken(cardData, handler);
        }
        if (value === 'coupon') {
            var coupon = $('#signup-coupon').val();
            this.createUser({ couponCode: coupon });
        }
        this.setSignupSubmitButtonDisabled(true);
        this.$('#signup-error-alert').addClass('hide');
    },
    /**
     * @method handleSubmitFormResponse
     */
    handleSubmitFormStripeResponse: function(status, response) {
        if (response.error) {
            this.setSignupErrorAlertMessage(response.error.message);
            this.$('.credit').closest('.form-group').addClass('has-error');
            this.setSignupSubmitButtonDisabled(false);
        }
        else {
            var token = response.id;
            this.createUser({ token: token });
        }
    },
    /**
     * property products
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
     * @method setSignupSubmitButtonDisabled
     */
    setSignupSubmitButtonDisabled: function(disabled) {
        var button = this.$('#signup-submit');
        button.attr('disabled', disabled);
        button.find('span').toggleClass('hide', disabled);
        button.find('i').toggleClass('hide', !disabled);
    },
    /**
     * @method setSignupErrorAlertMessage
     * @param {String} message
     */
    setSignupErrorAlertMessage: function(message) {
        this.$('#signup-error-alert').text(message).removeClass('hide');
    }
});
