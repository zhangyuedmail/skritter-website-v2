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
            this.listenTo(app.user.schedule, 'sort', this.updateDueCount);
            this.listenTo(app.user.data.vocablists, 'add change', this.updateListTable);
        },
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            app.sidebars.enable();
            this.elements.listContainer = this.$('.list-container');
            this.elements.messageExpired = this.$('.message-expired');
            this.elements.messageRegister = this.$('.message-register');
            this.elements.scheduleDueCount = this.$('.schedule-duecount');
            this.elements.userAvatar = this.$('.user-avatar');
            this.elements.userDisplayName = this.$('.user-displayname');
            this.listTable.setElement(this.elements.listContainer).render()
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
            this.updateDueCount();
            this.updateListTable();
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-register': 'handleButtonRegisterClicked'
        }),
        /**
         * @method handleButtonRegisterClicked
         * @param {Event} event
         */
        handleButtonRegisterClicked: function(event) {
            event.preventDefault();
            app.router.navigate('getting-started/signup', {trigger: true});
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.elements.scheduleDueCount.text(app.user.schedule.getDueCount());
        },
        /**
         * @method updateListTable
         */
        updateListTable: function() {
            this.listTable.setFields({
                name: 'Title',
                studyingMode: 'Status'
            }).filterActive();
        }
    });

    return PageHome;
});
