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
        },
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
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
            this.elements.userAvatar.html(app.user.getAvatar());
            this.elements.userDisplayName.text(app.user.settings.get('name'));
            this.updateDueCount();
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
