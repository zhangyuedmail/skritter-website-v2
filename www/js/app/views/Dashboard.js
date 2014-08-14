/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "require.text!templates/dashboard.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewDashboard
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {
            this.listenTo(app.user.data.items, "sort", this.updateDueCount);
        },
        /**
         * @property title
         * @type String
         */
        title: "Dashboard",
        /**
         * @method render
         * @returns {GelatoPage}
         */
        render: function() {
            this.$el.html(this.compile(template));
            this.elements.statDue = this.$(".stat-due");
            this.elements.statTime = this.$(".stat-time");
            this.elements.userAvatar = this.$(".user-avatar");
            this.elements.userLevel = this.$(".user-level");
            this.elements.userLevelTitle = this.$(".user-level-title");
            this.elements.userName = this.$(".user-name");
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {GelatoPage}
         */
        renderElements: function() {
            this.elements.userAvatar.html(app.user.getAvatar("img-thumbnail"));
            this.elements.userName.text(app.user.settings.get("name"));
            return this;
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.elements.userLevel.text(app.user.getLevel().level);
            this.elements.userLevelTitle.text(app.user.getLevel().title);
            this.elements.statDue.text(app.user.data.items.getDueCount());
        }
    });
});
