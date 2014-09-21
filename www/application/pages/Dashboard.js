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
            this.listTable = undefined;
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
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageDashboard}
         */
        renderElements: function() {
            if (false) {
                this.elements.messageExpired.show();
            } else {
                this.elements.messageExpired.hide();
            }
            if (app.user.isRegistered()) {
                this.elements.messageRegister.hide();
            } else {
                this.elements.messageRegister.show();
            }
            this.elements.userAvatar.html(app.user.getAvatar('img-thumbnail'));
            this.elements.userDisplayName.text(app.user.getDisplayName());
            this.listTable = app.user.data.vocablists.getActive()
                .getTable(this.elements.listContainer, {
                    name: 'Title',
                    studyingMode: 'Status'
                }).render();
            this.updateDueCount();
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
         * @returns {PageDashboard}
         */
        updateDueCount: function() {
            this.elements.scheduleDueCount.text(app.user.schedule.getDueCount());
        }
    });

    return PageHome;
});
