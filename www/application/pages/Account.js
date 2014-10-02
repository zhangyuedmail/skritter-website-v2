/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/mobile/account.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageAccount
     * @extends BasePage
     */
    var PageAccount = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.account.title;
            this.settings = app.user.settings;
            this.sub = app.user.subscription;
        },
        /**
         * @method render
         * @returns {PageAccount}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.accountCountry = this.$('#account-country');
            this.elements.accountDisplayName = this.$('#account-displayname');
            this.elements.accountID = this.$('#account-id');
            this.elements.accountEmail = this.$('#account-email');
            this.elements.accountTimezone = this.$('#account-timezone');
            this.elements.subDetail = this.$('#sub-detail');
            this.elements.subDetailMethod = this.$('#sub-detail-method');
            this.elements.subDetailPlan = this.$('#sub-detail-plan');
            this.elements.subDetailRecurring = this.$('#sub-detail-recurring');
            this.elements.subMessage = this.$('#sub-message');
            this.elements.subStatus = this.$('#sub-status');
            this.elements.subButtonCancel = this.$('#subscribe-cancel');
            this.elements.subButtonMonth = this.$('#subscribe-month');
            this.elements.subButtonYear = this.$('#subscribe-year');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageAccount}
         */
        renderElements: function() {
            if (this.sub.isExpired()) {
                this.elements.subStatus.addClass('text-danger').text('Expired');
                this.elements.subButtonCancel.hide();
                this.elements.subDetail.hide();
            } else if (!this.sub.isExpired() && !this.sub.get('subscribed')) {
                this.elements.subStatus.addClass('text-success').text('Active');
                this.elements.subDetail.hide();
                this.elements.subButtonCancel.hide();
                this.elements.subButtonMonth.hide();
                this.elements.subButtonYear.hide();
            } else {
                this.elements.subStatus.addClass('text-success').text('Active');
                this.elements.subDetail.show();
                this.elements.subButtonMonth.hide();
                this.elements.subButtonYear.hide();
            }
            if (this.sub.get('subscribed')) {
                this.elements.subDetailMethod.text(this.sub.get('subscribed'));
                this.elements.subDetailPlan.text(this.sub.get('plan'));
                this.elements.subDetailRecurring.text(this.sub.get('expires'));
                switch (this.sub.get('subscribed')) {
                    case 'ios':
                        this.elements.subButtonCancel.hide();
                        this.elements.subButtonMonth.hide();
                        this.elements.subButtonYear.hide();
                        break;
                    case 'skritter':
                        this.elements.subButtonCancel.hide();
                        this.elements.subButtonMonth.hide();
                        this.elements.subButtonYear.hide();
                        break;
                }
            }
            //TODO: remove this once you know if cancelling it possible
            this.elements.subButtonCancel.hide();
            this.elements.accountCountry.val(this.settings.get('country'));
            this.elements.accountID.val(this.settings.get('id'));
            this.elements.accountDisplayName.val(this.settings.get('name'));
            this.elements.accountEmail.val(this.settings.get('email'));
            this.loadTimezones();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-download-all': 'handleButtonDownloadAllClicked',
            'vclick #button-restore-subscription': 'handleButtonRestoreSubscriptionClicked',
            'vclick #subscribe-month': 'handleSubscribeMonth',
            'vclick #subscribe-year': 'handleSubscribeYear'
        }),
        /**
         * @method handleButtonDownloadAllClicked
         * @param {Event} event
         */
        handleButtonDownloadAllClicked: function(event) {
            event.preventDefault();
            app.dialogs.show().element('.message-title').text('Downloading Data');
            app.dialogs.element('.message-text').text('');
            app.user.data.items.downloadAll(function() {
                app.reload();
            }, function() {
                app.dialogs.element('.message-title').text('Something went wrong.');
                app.dialogs.element('.message-text').text('Check your connection and click reload.');
                app.dialogs.element('.message-other').html(app.fn.bootstrap.button('Reload', {level: 'primary'}));
                app.dialogs.element('.message-other button').on('vclick', app.reload);
            });
        },
        /**
         * @method handleButtonRestoreSubscriptionClicked
         */
        handleButtonRestoreSubscriptionClicked: function() {
            app.dialogs.show().element('.message-title').text('Restoring Subscription');
            app.user.subscription.restoreGoogle(function() {
                app.dialogs.element('.message-title').text('Subscription Restored');
                app.dialogs.element('.loader-image').hide();
                app.dialogs.element('.message-text').text("Please click to reload the application.");
                app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button("Reload", {level: 'primary'}));
                app.dialogs.element('.message-confirm button').on('vclick', function() {
                    app.reload();
                });
            }, function(error) {
                app.dialogs.element('.message-title').text('Subscription Error');
                app.dialogs.element('.loader-image').hide();
                app.dialogs.element('.message-text').text(error);
                app.dialogs.element('.message-close').html(app.fn.bootstrap.button("Close", {level: 'default'}));
                app.dialogs.element('.message-close button').on('vclick', function() {
                    app.dialogs.hide();
                });
            });
        },
        /**
         * @method handleSubscribeMonth
         */
        handleSubscribeMonth: function() {
            var self = this;
            this.sub.subscribeGoogle('one.month.sub', function() {
                app.reload();
            }, function(error) {
                self.elements.subMessage.addClass('text-danger').text(error);
            });
        },
        /**
         * @method handleSubscribeYear
         */
        handleSubscribeYear: function() {
            var self = this;
            this.sub.subscribeGoogle('one.year.sub', function() {
                app.reload();
            }, function(error) {
                self.elements.subMessage.addClass('text-danger').text(error);
            });
        },
        /**
         * @method loadTimezones
         * @returns {PageAccount}
         */
        loadTimezones: function() {
            var options = [];
            var timezones = moment.tz.names();
            for (var i = 0, length = timezones.length; i < length; i++) {
                var option = "<option value='" + timezones[i] + "'>";
                option += timezones[i] + ' | ' + moment().tz(timezones[i]).format('HH:mm');
                option += "</option>";
                options.push(option);
            }
            this.elements.accountTimezone.html(options);
            this.elements.accountTimezone.val(this.settings.get('timezone'));
            return this;
        }
    });

    return PageAccount;
});
