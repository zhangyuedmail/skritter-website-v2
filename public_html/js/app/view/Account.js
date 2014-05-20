/**
 * @module Skritter
 * @submodule View
 * @param templateAccount
 * @author Joshua McFarland
 */
define([
    'require.text!template/account.html'
], function(templateAccount) {
    /**
     * @class Account
     */
    var Account = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.settings = skritter.user.settings;
            this.subscription = skritter.user.subscription;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            document.title = "Skritter - Account";
            this.$el.html(templateAccount);
            this.showGeneral();
            this.showLanguage();
            this.showLocation();
            this.showSubscription();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-subscription-cancel': ' handleCancelSubscriptionClicked',
            'vclick .button-subscription-subscribe': 'handleSubscribeClicked'
        },
        /**
         * @method handleCancelSubscriptionClicked
         * @param {Object} event
         */
        handleCancelSubscriptionClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleSubscribeClicked
         * @param {Object} event
         */
        handleSubscribeClicked: function(event) {
            if (window.cordova) {
                this.subscription.subscribeGplay('one.year.sub');
            } else {
                this.subscription.subscribe();
            }
           event.preventDefault(); 
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method showGeneral
         */
        showGeneral: function() {
            var userName = skritter.user.settings.get('name');
            var userId = skritter.user.id;
            if (userName === userId) {
                this.$('#user-name').text(userId);
            } else {
                this.$('#user-name').text(skritter.user.settings.get('name'));
                this.$('#user-id').text('(' + userId + ')');
            }
            this.$('#user-avatar').html(skritter.user.settings.getAvatar('img-thumbnail'));
            this.$('#user-about-me').html(skritter.user.settings.get('aboutMe'));
        },
        /**
         * @method showLanguage
         */
        showLanguage: function() {
            this.$('#language').text(this.settings.isChinese() ? 'Chinese' : 'Japanese');
            if (this.settings.isChinese()) {
                if (this.settings.get('reviewSimplified') && this.settings.get('reviewTraditional')) {
                    this.$('#language-style').text('Simplified and Traditional');
                } else if (this.settings.get('reviewSimplified') && !this.settings.get('reviewTraditional')) {
                    this.$('#language-style').text('Simplified');
                } else {
                    this.$('#language-style').text('Traditional');
                }
            }
        },
        /**
         * @method showLocation
         */
        showLocation: function() {
            this.$('#location-country').text(this.settings.get('country'));
            this.$('#location-timezone').text(moment().tz(this.settings.get('timezone')).format('hh:mm A') + ' | ' + this.settings.get('timezone'));
        },
        /**
         * @method showSubscription
         */
        showSubscription: function() {
            var date = moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD');
            var subscribed = this.subscription.get('subscribed');
            var expires = this.subscription.get('expires');
            if (this.subscription.isExpired()) {
                this.$('.subscription-status').text('Inactive');
                this.$('.subscription-status').addClass('text-danger');
                this.$('.button-subscription-subscribe').show();
                this.$('.button-subscription-cancel').hide();
                if (window.cordova) {
                    this.$('#select-subscription-cycle').show();
                } else {
                    this.$('#select-subscription-cycle').hide();
                }
            } else {
                this.$('.subscription-expires').text(expires);
                if (expires > date) {
                    this.$('.subscription-status').text('Active');
                    this.$('.subscription-status').addClass('text-success');
                    this.$('.subscription-type').text(this.subscription.getType());
                    this.$('#select-subscription-cycle').hide();
                    switch (subscribed) {
                        case 'gplay':
                            this.$('.subscription-plan').text(this.subscription.getGplayPlan());
                            this.$('.button-subscription-subscribe').hide();
                            this.$('.button-subscription-cancel').show();
                            break;
                        case 'ios':
                            this.$('.subscription-plan').text(this.subscription.getPlan());
                            this.$('.button-subscription-subscribe').hide();
                            this.$('.button-subscription-subscribe').hide();
                            break;
                        case 'skritter':
                            this.$('.subscription-plan').text(this.subscription.getPlan());
                            this.$('.button-subscription-subscribe').hide();
                            this.$('.button-subscription-subscribe').hide();
                            break;
                        default:
                            this.$('.subscription-plan').text(this.subscription.getPlan());
                            this.$('.button-subscription-subscribe').hide();
                            this.$('.button-subscription-cancel').hide();
                            break;
                    }
                } else if (expires === false) {
                    this.$('.subscription-status').text('Active');
                    this.$('.subscription-plan').text('Unlimited');
                    this.$('.button-subscription-subscribe').hide();
                    this.$('.button-subscription-cancel').hide();
                    this.$('#select-subscription-cycle').hide();
                } else {
                    this.$('.subscription-plan').text();
                    this.$('.subscription-status').text('Inactive');
                    this.$('.subscription-status').addClass('text-danger');
                    this.$('.button-subscription-subscribe').show();
                    this.$('.button-subscription-cancel').hide();
                    this.$('#select-subscription-cycle').show();
                }
            }
        }
    });

    return Account;
});