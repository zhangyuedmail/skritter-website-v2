/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/account-creation/create-account.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageCreateAccount
     * @extends BasePage
     */
    var PageCreateAccount = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings['account-creation'].title;
        },
        /**
         * @method render
         * @returns {PageCreateAccount}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {})
    });

    return PageCreateAccount;
});