/**
 * @module Skritter
 * @submodule Views
 * @param templateLoggedIn
 * @param templateLoggedOut
 * @author Joshua McFarland
 */
define([
    'require.text!templates/home-logged-in.html',
    'require.text!templates/home-logged-out.html'
], function(templateLoggedIn, templateLoggedOut) {
    /**
     * @class Home
     */
    var Home = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html('');
            if (skritter.user.isLoggedIn()) {
                this.$el.html(templateLoggedIn);
                this.$('#user-avatar').html(skritter.user.settings.avatar('img-circle'));
                this.$('#user-items-due').html(skritter.user.data.items.dueCount());
                this.$('#user-username').html(skritter.user.settings.get('name'));
            } else {
                this.$el.html(templateLoggedOut);
                if (skritter.settings.language())
                    this.$('#target-language').html(skritter.settings.language() === 'zh' ? 'Chinese' : 'Japanese');
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Home #home-view #new-user-button': 'handleNewUserButtonClicked',
            'click.Home #home-view .login-button': 'handleLoginButtonClicked',
            'click.Home #home-view .logout-button': 'handleLogoutButtonClicked',
            'click.Home #home-view .study-button': 'handleStudyButtonClicked',
            'click.Home #home-view .sync-button': 'handleSyncButtonClicked',
            'click.Home #home-view .vocablists-button': 'handleVocabListsButtonClicked'
        },
        /**
         * @method handleLoginButtonClicked
         * @param {Object} event
         */
        handleLoginButtonClicked: function(event) {
            skritter.modals.show('login');
            event.preventDefault();
        },
        /**
         * @method handleLogoutButtonClicked
         * @param {Object} event
         */
        handleLogoutButtonClicked: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        /**
         * @method handleNewUserButtonClicked
         * @param {Object} event
         */
        handleNewUserButtonClicked: function(event) {
            skritter.modals.show('default')
                    .set('.modal-header', false)
                    .set('.modal-body', '<h3>Try the tutorial first?</h3>')
                    .set('#default-button', 'No thanks')
                    .set('#primary-button', "Let's go");
            event.preventDefault();
        },
        /**
         * @method handleStudyButtonClicked
         * @param {Object} event
         */
        handleStudyButtonClicked: function(event) {
            skritter.router.navigate('study', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleSyncButtonClicked
         * @param {Object} event
         */
        handleSyncButtonClicked: function(event) {
            skritter.user.data.sync(null, true);
            event.preventDefault();
        },
        /**
         * @method handleStudyButtonClicked
         * @param {Object} event
         */
        handleVocabListsButtonClicked: function(event) {
            skritter.router.navigate('vocab/list', {trigger: true});
            event.preventDefault();
        }
    });
    
    return Home;
});