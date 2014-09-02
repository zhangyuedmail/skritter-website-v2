/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/login.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageLogin
     * @extends BasePage
     */
    var PageLogin = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.login.title;
        },
        /**
         * @method render
         * @returns {PageLogin}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick .button-login': 'handleButtonLoginClicked',
            'vclick .button-new': 'handleButtonNewClicked'
        }),
        /**
         * @method handleButtonLoginClicked
         * @param {Event} event
         */
        handleButtonLoginClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleButtonNewClicked
         * @param {Event} event
         */
        handleButtonNewClicked: function(event) {
            event.preventDefault();
        }
    });

    return PageLogin;
});
