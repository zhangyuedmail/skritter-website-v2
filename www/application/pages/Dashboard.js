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
            this.listenTo(app.user.schedule, 'sort', this.updateStatSection);
            this.listenTo(app.user.stats, 'change', this.updateStatSection);
        },
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.buttonSync = this.$('#sync-button');
            this.elements.expiredNotice = this.$('#expired-notice');
            this.elements.listContainer = this.$('.list-container');
            this.elements.trialRemaining = this.$('#trial-remaining');
            this.elements.statsDue = this.$('.stats-due');
            this.elements.statsTime = this.$('.stats-time');
            this.elements.userAvatar = this.$('.user-avatar');
            this.elements.userDisplayName = this.$('.user-displayname');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageDashboard}
         */
        renderElements: function() {
            app.user.stats.sync();
            app.user.schedule.updateFilter();
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
            'vclick #button-sync': 'handleSyncClicked'
        }),
        /**
         * @method handleButtonHideExpires
         * @param {Event} event
         */
        handleButtonHideExpires: function(event) {
            event.preventDefault();
            app.user.settings.set('hideExpired', moment().add(1, 'week').unix());
            this.elements.expiredNotice.hide();
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
         * @method updateStatSection
         */
        updateStatSection: function() {
            this.elements.statsDue.text(app.user.schedule.getDueCount());
            this.elements.statsTime.text(app.fn.convertTimeToClock(app.user.stats.getTime() * 1000));
        }
    });

    return PageDashboard;
});
