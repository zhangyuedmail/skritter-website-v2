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
            var date = moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD');
            var userName = skritter.user.settings.get('name');
            var userId = skritter.user.id;
            //general
            if (userName === userId) {
                this.$('#user-name').text(userId);
            } else {
                this.$('#user-name').text(skritter.user.settings.get('name'));
                this.$('#user-id').text('(' + userId + ')');
            }
            this.$('#user-avatar').html(skritter.user.settings.getAvatar('img-thumbnail'));
            this.$('#user-about-me').html(skritter.user.settings.get('aboutMe'));
            //subscription
            var expires = this.subscription.get('expires');
            var plan = this.subscription.get('plan');
            if (expires <= date) {
                this.$('.button-cancel-subscription').hide();
                this.$('#subscription-expires').html("Your account expired on <strong>" + expires + '</strong>');
                switch (plan) {
                    case 'one_month':
                        this.$('#subscription-plan').html('and was billed every <strong>month</strong>.');
                        break;
                    case 'six_months':
                        this.$('#subscription-plan').html('and was billed every <strong>six months</strong>.');
                        break;
                    case 'twelve_months':
                        this.$('#subscription-plan').html('and was billed every <strong>year</strong>.');
                        break;
                    case 'twelve_months':
                        this.$('#subscription-plan').html('and was billed every two <strong>years</strong>.');
                        break;
                }
            } else if (expires > date) {
                this.$('.button-start-subscription').hide();
                this.$('#subscription-expires').html("Your account is active until <strong>" + expires + '</strong>');
                switch (plan) {
                    case 'one_month':
                        this.$('#subscription-plan').html('and is billed every <strong>month</strong>.');
                        break;
                    case 'six_months':
                        this.$('#subscription-plan').html('and is billed every <strong>six months</strong>.');
                        break;
                    case 'twelve_months':
                        this.$('#subscription-plan').html('and is billed every <strong>year</strong>.');
                        break;
                    case 'twelve_months':
                        this.$('#subscription-plan').html('and is billed every two <strong>years</strong>.');
                        break;
                }
            } else if (expires === false) {
                this.$('#subscription-expires').html("Your account is infinitely free, nice!");
                this.$('.button-cancel-subscription').hide();
                this.$('.button-start-subscription').hide();
            } else {
                this.$('#subscription-expires').html("Your account does not current have an active subscription.");
                this.$('.button-cancel-subscription').hide();
            }
            //language
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
            //location
            this.$('#location-country').text(this.settings.get('country'));
            this.$('#location-timezone').text(moment().tz(this.settings.get('timezone')).format('hh:m A') + ' | ' + this.settings.get('timezone'));
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        }
    });
    
    return Account;
});