/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/account-creation/language-select.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageLanguageSelect
     * @extends BasePage
     */
    var PageLanguageSelect = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings['account-creation'].title;
        },
        /**
         * @method render
         * @returns {PageLanguageSelect}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            this.elements.languageContainer = this.$('#language-container');
            this.elements.chineseOptions = this.$('#chinese-options-container');
            this.elements.chineseOptions.hide();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick .language-select': 'handleLanguageSelected'
        }),
        /**
         * @method handleLanguageSelected
         * @param {Function} event
         */
        handleLanguageSelected: function(event) {
            event.preventDefault();
            switch (event.target.id) {
                case 'select-chinese':
                    this.elements.languageContainer.hide();
                    this.elements.chineseOptions.show();
                    break;
                case 'select-chinese-both':
                    app.api.setGuest('lang', 'zh');
                    app.api.setGuest('style', 'both');
                    this.next();
                    break;
                case 'select-chinese-simp':
                    app.api.setGuest('lang', 'zh');
                    app.api.setGuest('style', 'simp');
                    this.next();
                    break;
                case 'select-chinese-trad':
                    app.api.setGuest('lang', 'zh');
                    app.api.setGuest('style', 'trad');
                    this.next();
                    break;
                case 'select-japanese':
                    app.api.setGuest('lang', 'ja');
                    this.next();
                    break;
            }
        },
        /**
         * @method next
         */
        next: function() {
            app.router.accountCreation.switch('ListSelect');
        }
    });

    return PageLanguageSelect;
});
