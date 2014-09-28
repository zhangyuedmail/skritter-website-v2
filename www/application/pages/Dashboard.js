/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/dashboard.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageDashboard
     * @extends BasePage
     */
    var PageHome = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.dashboard.title;
            this.listTable = app.user.data.vocablists.getTable();
            this.listenTo(app.user.schedule, 'sort', this.updateStatSection);
            this.listenTo(app.user.stats, 'change', this.updateStatSection);
            this.listenTo(app.user.data.vocablists, 'add change', this.updateListSection);
        },
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            app.sidebars.enable();
            this.elements.buttonSync = this.$('#sync-button');
            this.elements.listContainer = this.$('.list-container');
            this.elements.messageExpired = this.$('.message-expired');
            this.elements.messageRegister = this.$('.message-register');
            this.elements.statsDue = this.$('.stats-due');
            this.elements.statsNew = this.$('.stats-new');
            this.elements.statsTime = this.$('.stats-time');
            this.elements.statsStudied = this.$('.stats-studied');
            this.elements.userAvatar = this.$('.user-avatar');
            this.elements.userDisplayName = this.$('.user-displayname');
            this.listTable.setElement(this.elements.listContainer).render();
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
            this.updateListSection();
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-add-new': 'handleButtonAddNewClicked',
            'vclick #button-sync': 'handleButtonSyncClicked'
        }),
        /**
         * @method handleButtonAddNewClicked
         * @param {Event} event
         */
        handleButtonAddNewClicked: function(event) {
            event.preventDefault();
            app.user.data.addItems({limit: 1, showDialog: true});
        },
        /**
         * @method handleButtonSyncClicked
         * @param {Event} event
         */
        handleButtonSyncClicked: function(event) {
            event.preventDefault();
            app.dialogs.show().element('.message-title').text('Syncing');
            app.dialogs.element('.message-text').text('');
            app.user.data.sync(function() {
                app.dialogs.hide();
            }, function() {
                app.dialogs.hide();
            });
        },
        /**
         * @method updateStatSection
         */
        updateStatSection: function() {
            this.elements.statsDue.text(app.user.schedule.getDueCount());
            this.elements.statsNew.text(app.user.schedule.getNewCount());
            this.elements.statsStudied.text(app.user.stats.getStudied());
            this.elements.statsTime.text(app.fn.convertTimeToClock(app.user.stats.getTime() * 1000));
        },
        /**
         * @method updateListSection
         */
        updateListSection: function() {
            this.listTable.setFields({
                name: 'Title',
                studyingMode: 'Status'
            }).filterActive();
        }
    });

    return PageHome;
});
