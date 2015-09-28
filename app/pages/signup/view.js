var GelatoPage = require('gelato/page');
var MarketingFooter = require('components/marketing-footer/view');
var DefaultNavbar = require('navbars/default/view');
var MarketingNavbar = require('navbars/marketing/view');
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
        if (app.user.isLoggedIn()) {
            this.navbar = new DefaultNavbar();
        } else {
            this.navbar = new MarketingNavbar();
        }
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
        'submit form': 'handleSubmitForm'
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
        this.footer.setElement('#footer-container');
        this.footer.render();
        this.navbar.render();
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
     * @method handleSubmitForm
     * @param {Event} event
     */
    handleSubmitForm: function(event) {
        event.preventDefault();
        var cardData = {
            number: this.$('#signup-card-number').val(),
            exp_month: this.$('#card-month-select').val(),
            exp_year: this.$('#card-year-select').val()
        };
        if (cardData.number) {
            var handler = _.bind(this.handleSubmitFormResponse, this);
            Stripe.setPublishableKey(app.getStripeKey());
            Stripe.card.createToken(cardData, handler);
            this.setSignupSubmitButtonDisabled(true);
        }
        else {
            // TODO, coupon/school validation
        }
        this.$('#signup-error-alert').addClass('hide');
    },
    /**
     * @method handleSubmitFormResponse
     */
    handleSubmitFormResponse: function(status, response) {
        if (response.error) {
            this.setSignupSubmitButtonDisabled(false);
            this.$('#signup-error-alert')
              .text(response.error.message)
              .removeClass('hide');
        }
        else {
            var token = response.id;
            this.username = $('#signup-username').val();
            this.password = $('#signup-password1').val();
            var user = new User({
                'name': this.username,
                'password': this.password,
                'email': $('#signup-email').val(),
                'plan': $('#signup-plan').val(),
                'token': token,
            });
            user.headers = this.session.getHeaders();
            user.save();
            this.listenToOnce(user, 'sync', this.handleSubmitFormResponseCreateUser);

        }
    },
    /**
     * @method handleSubmitFormResponseCreateUser
     */
    handleSubmitFormResponseCreateUser: function() {
        app.user.login(this.username, this.password, function() {
            app.router.navigate('dashboard', {trigger: false});
            app.reload();
        }, _.bind(function(error) {
            this.setSignupSubmitButtonDisabled(false);
            this.$('#signup-error-alert')
              .text(error.responseJSON.message)
              .removeClass('hide');
        }, this));
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
    }
});
