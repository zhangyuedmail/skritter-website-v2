var GelatoPage = require('gelato/page');
var SettingsSidebar = require('components/settings-sidebar/view');
var DefaultNavbar = require('navbars/default/view');
var Subscription = require('models/subscription');
var Coupon = require('models/coupon');
var VacationDialog = require('dialogs/vacation/view');

/**
 * @class BillingSubscription
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #redeem-code-btn': 'handleClickRedeemCodeButton',
        'vclick #go-on-vacation-link': 'handleClickGoOnVacationLink',
        'vclick #cancel-vacation-link': 'handleClickCancelVacationLink',
        'vclick #unsubscribe-itunes-btn': 'handleClickUnsubscribeITunesButton',
        'vclick #subscribe-stripe-btn': 'handleClickSubscribeStripeButton',
        'vclick #update-stripe-subscription-btn': 'handleClickUpdateStripeSubscriptionButton'
    },
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new SettingsSidebar();
        this.subscription = new Subscription({ id: app.user.id });
        this.subscription.fetch();
        this.listenTo(this.subscription, 'state', this.renderMainContent);
        this.coupon = new Coupon({ code: '' });
        this.listenTo(this.coupon, 'sync', function(model, response) {
            this.subscription.set(response.Subscription);
            this.coupon.unset('code');
        });
        // this.listenToOnce(this.subscription, 'sync', function() {
        //     this.subscription.set('subscribed', 'paypal'); // TESTING
        // });
        this.listenTo(this.coupon, 'state', this.renderMainContent);
    },
    /**
     * @method remove
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.render();
        this.sidebar.setElement('#settings-sidebar-container').render();
        return this;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Subscription - Skritter',
    /**
     * @method handleClickCancelVacationLink
     */
    handleClickCancelVacationLink: function() {
        this.subscription.save({ vacation: false }, {
            parse: true,
            method: 'PUT'
        });
        this.$('#cancel-vacation-spinner').removeClass('hide');
        this.$('#cancel-vacation-link').addClass('hide');
    },
    /**
     * @method handleClickGoOnVacationLink
     */
    handleClickGoOnVacationLink: function() {
        var dialog = new VacationDialog({subscription: this.subscription});
        dialog.render().open();
    },
    /**
     * @method handleClickRedeemCodeButton
     */
    handleClickRedeemCodeButton: function() {
        this.coupon.set('code', this.$('#code-input').val());
        this.coupon.use();
        this.renderMainContent();
    },
    /**
     * @method handleClickSubscribeStripeButton
     */
    handleClickSubscribeStripeButton: function() {
        var cardData = {
            number: this.$('#card-number-input').val(),
            exp_month: this.$('#card-month-select').val(),
            exp_year: this.$('#card-year-select').val()
        };
        var handler = _.bind(this.handleClickSubscribeStripeButtonResponse, this);
        Stripe.setPublishableKey(app.getStripeKey());
        Stripe.card.createToken(cardData, handler);
        this.setSubscribeStripeButtonDisabled(true);
        this.$('#card-error-alert').addClass('hide');
    },
    /**
     * @method this.handleClickSubscribeStripeButtonResponse
     */
    handleClickSubscribeStripeButtonResponse: function(status, response) {
        if (response.error) {
            this.setSubscribeStripeButtonDisabled(false);
            this.$('#card-error-alert')
              .text(response.error.message)
              .removeClass('hide');
        }
        else {
            var token = response.id;
            var url = (
                app.getApiUrl() +
                this.subscription.url() +
                '/stripe/subscribe');
            var headers = app.user.session.getHeaders();
            var data = {
                token: token,
                plan: this.$('#plan-select').val()
            };
            $.ajax({
                url: url,
                headers: headers,
                method: 'POST',
                data: data,
                context: this,
                success: function(response) {
                    this.subscription.set(response.Subscription);
                    this.renderMainContent();
                }
            })
        }
    },
    /**
     * @method handleClickUnsubscribeITunesButton
     */
    handleClickUnsubscribeITunesButton: function() {
        var url = app.getApiUrl() + this.subscription.url() + '/ios/cancel';
        var headers = app.user.session.getHeaders();
        this.$('#unsubscribe-itunes-btn *').toggleClass('hide');
        $.ajax({
            url: url,
            headers: headers,
            method: 'POST',
            context: this,
            success: function(response) {
                this.subscription.set(response.Subscription);
                this.renderMainContent();
            }
        })
    },
    /**
     * @method handleClickUpdateStripeSubscriptionButton
     */
    handleClickUpdateStripeSubscriptionButton: function() {
        var cardData = {
            number: this.$('#card-number-input').val(),
            exp_month: this.$('#card-month-select').val(),
            exp_year: this.$('#card-year-select').val()
        };
        if (cardData.number) {
            var handler = _.bind(this.handleClickUpdateStripeSubscriptionButtonResponse, this);
            Stripe.setPublishableKey(app.getStripeKey());
            Stripe.card.createToken(cardData, handler);
            this.setSubscribeStripeButtonDisabled(true);
        }
        else {
            var url = (
                app.getApiUrl() + this.subscription.url() + '/stripe');
            var headers = app.user.session.getHeaders();
            var data = { plan: this.$('#plan-select').val() };
            $.ajax({
                url: url,
                headers: headers,
                method: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(data),
                context: this,
                success: function(response) {
                    this.subscription.set(response.Subscription);
                    this.renderMainContent();
                }
            });
            this.setSubscribeStripeButtonDisabled(true);
        }
        this.$('#card-error-alert').addClass('hide');
    },
    /**
     * @method this.handleClickSubscribeStripeButtonResponse
     */
    handleClickUpdateStripeSubscriptionButtonResponse: function(status, response) {
        if (response.error) {
            this.setSubscribeStripeButtonDisabled(false);
            this.$('#card-error-alert')
              .text(response.error.message)
              .removeClass('hide');
        }
        else {
            var token = response.id;
            var url = (
                app.getApiUrl() + this.subscription.url() + '/stripe');
            var headers = app.user.session.getHeaders();
            var data = {
                token: token,
                plan: this.$('#plan-select').val()
            };
            $.ajax({
                url: url,
                headers: headers,
                method: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(data),
                context: this,
                success: function(response) {
                    this.subscription.set(response.Subscription);
                    this.renderMainContent();
                }
            })
        }
    },
    /**
     * @method renderSectionContent
     */
    renderMainContent: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('.main-content').replaceWith(rendering.find('.main-content'));
    },
    /**
     * @method setSubscribeStripeButtonDisabled
     */
    setSubscribeStripeButtonDisabled: function(disabled) {
        var button = this.$('#update-stripe-subscription-btn, #subscribe-stripe-btn');
        button.attr('disabled', disabled);
        button.find('span').toggleClass('hide', disabled);
        button.find('i').toggleClass('hide', !disabled);
    }
});
