/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/mobile/dashboard.html'
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
            this.elements.listContainer = this.$('.list-container');
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
            this.elements.userAvatar.html(app.user.getAvatar('img-thumbnail'));
            this.elements.userDisplayName.text(app.user.getDisplayName());
            this.updateStatSection();
            app.user.stats.sync();
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-sync': 'handleSyncClicked'
        }),
        /**
         * @method handleSyncClicked
         * @param {Event} event
         */
        handleSyncClicked: function(event) {
            event.preventDefault();
            app.dialogs.show().element('.message-title').text('Syncing Account');
            async.series([
                function(callback) {
                    app.dialogs.element('.message-text').text('UPDATING ITEMS');
                    app.user.data.items.sync(callback, callback);
                },
                function(callback) {
                    app.user.data.sync(0, callback, callback);
                }
            ], function() {
                app.dialogs.hide();
            });
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
