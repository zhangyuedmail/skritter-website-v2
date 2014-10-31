/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/dashboard.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageDashboard
     * @extends BasePage
     */
    var PageDashboard = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.dashboard.title;
            this.listenTo(app.user.data, 'sync', this.toggleSyncButton);
            this.listenTo(app.user.schedule, 'sort', this.updateStatSection);
            this.listenTo(app.user.stats, 'change', this.updateStatSection);
        },
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.buttonSync = this.$('#button-sync');
            this.elements.expiredNotice = this.$('#expired-notice');
            this.elements.listContainer = this.$('.list-container');
            this.elements.rateMessage = this.$('.rate-message');
            this.elements.rateNotice = this.$('#rate-notice');
            this.elements.rateThankyou = this.$('.rate-thankyou');
            this.elements.rateTitle = this.$('.rate-title');
            this.elements.statsDue = this.$('.stats-due');
            this.elements.statsTime = this.$('.stats-time');
            this.elements.trialRemaining = this.$('#trial-remaining');
            this.elements.userAvatar = this.$('.user-avatar');
            this.elements.userDisplayName = this.$('.user-displayname');
            this.renderElements();
            this.loadFont();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageDashboard}
         */
        renderElements: function() {
            app.user.stats.sync();
            app.user.schedule.updateFilter();
            this.toggleSyncButton(app.user.data.syncing);
            this.elements.userAvatar.html(app.user.getAvatar('img-thumbnail'));
            this.elements.userDisplayName.text(app.user.getDisplayName());
            if (app.user.subscription.isExpired()) {
                if (app.user.settings.get('hideExpired') > moment().unix()) {
                    this.elements.expiredNotice.hide();
                } else {
                    this.elements.expiredNotice.find('.expired-title').text('Subscription Expired');
                    this.elements.expiredNotice.find('.expired-message').text('Continue adding new items and lists to study by purchasing a subscription on the account page.');
                    this.elements.expiredNotice.show();
                }
            } else {
                this.elements.expiredNotice.hide();
            }
            if (app.isNative() && app.user.settings.get('showRate') && app.user.subscription.isSubscribed()) {
                this.elements.rateTitle.text('Spread the word.');
                this.elements.rateMessage.text('If you love Skritter and are learning lots of characters, you can help us by going to the Play Store and rating us 5 stars.');
                if (app.user.isChinese()) {
                    this.elements.rateThankyou.text('谢谢!');
                } else {
                    this.elements.rateThankyou.text('ありがとうございます!');
                }
            } else {
                this.elements.rateNotice.hide();
            }
            if (app.user.subscription.getRemainingTrial()) {
                this.elements.trialRemaining.find('span').text(app.user.subscription.getRemainingTrial());
            } else {
                this.elements.trialRemaining.hide();
            }
            this.updateStatSection();
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-hide-expired': 'handleButtonHideExpires',
            'vclick #button-hide-rate': 'handleButtonHideRate',
            'vclick #button-expired': 'handleButtonExpired',
            'vclick #button-rate': 'handleButtonRate',
            'vclick #button-sync': 'handleSyncClicked'
        }),
        /**
         * @method handleButtonExpired
         * @param {Event} event
         */
        handleButtonExpired: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Dashboard', 'click', 'expired_account_button');
        },
        /**
         * @method handleButtonHideExpires
         * @param {Event} event
         */
        handleButtonHideExpires: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Dashboard', 'click', 'hide_expired_button');
            app.user.settings.set('hideExpired', moment().add(1, 'week').unix());
            this.elements.expiredNotice.hide();
        },
        /**
         * @method handleButtonHideRate
         * @param {Event} event
         */
        handleButtonHideRate: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Dashboard', 'click', 'hide_rate_button');
            app.user.settings.set('showRate', false);
            this.elements.rateNotice.hide();
        },
        /**
         * @method handleButtonRate
         * @param {Event} event
         */
        handleButtonRate: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Dashboard', 'click', 'rate_button');
            app.user.settings.set('showRate', false);
            this.elements.rateNotice.hide();
            if (plugins.core) {
                var packageName = app.user.isChinese() ? 'com.inkren.skritter.chinese' : 'com.inkren.skritter.japanese';
                plugins.core.openGooglePlay(packageName);
            }
        },
        /**
         * @method handleSyncClicked
         * @param {Event} event
         */
        handleSyncClicked: function(event) {
            event.preventDefault();
            if (!app.user.data.syncing) {
                app.dialogs.show().element('.message-title').text('Syncing Account');
                app.analytics.trackUserEvent('manual sync');
                async.series([
                    function(callback) {
                        app.dialogs.element('.message-text').text('UPDATING ITEMS');
                        app.user.data.items.sync(callback, callback);
                    },
                    function(callback) {
                        app.user.data.sync(0, callback, callback);
                    }
                ], function() {
                    app.user.schedule.sortFilter();
                    app.dialogs.hide();
                });
            }
        },
        /**
         * @method toggleSyncButton
         * @param {Boolean} status
         */
        toggleSyncButton: function(status) {
            if (status) {
                this.elements.buttonSync.hide();
            } else {
                this.elements.buttonSync.show();
            }
        },
        /**
         * @method updateStatSection
         */
        updateStatSection: function() {
            this.elements.statsDue.text(app.user.schedule.getDueCount());
            this.elements.statsTime.text(app.fn.convertTimeToClock(app.user.stats.getTime() * 1000));
        }
    });

    return PageDashboard;
});
