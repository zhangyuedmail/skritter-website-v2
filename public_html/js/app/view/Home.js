/**
 * @module Skritter
 * @submodule View
 * @param templateHomeLoggedIn
 * @param templateHomeLoggedOut
 * @author Joshua McFarland
 */
define([
    'require.text!template/home-logged-in.html',
    'require.text!template/home-logged-out.html'
], function(templateHomeLoggedIn, templateHomeLoggedOut) {
    /**
     * @class Home
     */
    var Home = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Home.languageCode = skritter.settings.getLanguageCode();
            this.listenTo(skritter.user.sync, 'sync', this.toggleSyncButton);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            if (skritter.user.isLoggedIn()) {
                this.$el.html(templateHomeLoggedIn);
                this.$('#user-avatar').html(skritter.user.settings.getAvatar('img-thumbnail'));
                this.$('#user-due-count').text(skritter.user.scheduler.getDueCount(true));
                this.$('#user-id').text(skritter.user.id);
            } else {
                this.$el.html(templateHomeLoggedOut);
                if (Home.languageCode) {
                    this.$('#language-text').text(Home.languageCode === 'zh' ? '中文' : '日本語');
                }
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click .button-existing-user': 'navigateLogin',
            'click .button-new-user': 'navigateNewUser',
            'click .button-logout': 'logout',
            'click .button-study': 'navigateStudy'
        },
        /**
         * @method logout
         * @param {Object} event
         */
        logout: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        /**
         * @method toggleSyncButton
         * @param {Boolean} disabled
         */
        toggleSyncButton: function(disabled) {
            if (disabled) {
                this.$('.button-sync').hide();
            } else {
                this.$('.button-sync').show();
            }
        },
        /**
         * @method navigateLogin
         * @param {Object} event
         */
        navigateLogin: function(event) {
            skritter.router.navigate('login', {trigger: true, replace: true});
            event.preventDefault();
        },
        /**
         * @method navigateNewUser
         * @param {Object} event
         */
        navigateNewUser: function(event) {
            skritter.router.navigate('user/new', {trigger: true, replace: true});
            event.preventDefault();
        },
        /**
         * @method navigateStudy
         * @param {Object} event
         */
        navigateStudy: function(event) {
            skritter.router.navigate('study', {trigger: true, replace: true});
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        }
    });
    
    return Home;
});