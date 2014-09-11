/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'pages/account-creation/LanguageSelect',
    'pages/account-creation/ListSelect'
], function(BaseRouter, PageLanguageSelect, PageListSelect) {
    /**
     * @class RouterAccountCreation
     * @extends BaseRouter
     */
    var RouterAccountCreation = BaseRouter.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property routes
         * @type Object
         */
        routes: {
            'account-creation': 'showAccountCreation'
        },
        /**
         * @method showAccountCreation
         */
        showAccountCreation: function() {
            var self = this;
            if (app.api.isGuestValid()) {
                this.showLanguageSelect();
            } else {
                app.api.authenticateGuest(function() {
                    self.showLanguageSelect();
                }, function() {
                    self.defaultRoute();
                });
            }
        },
        /**
         * @method showLanguageSelect
         */
        showLanguageSelect: function() {
            this.currentPage = new PageLanguageSelect();
            this.currentPage.render();
        },
        /**
         * @method showListSelect
         */
        showListSelect: function() {
            this.currentPage = new PageListSelect();
            this.currentPage.render();
        }
    });

    return RouterAccountCreation;
});
