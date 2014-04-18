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
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click #button-existing-user': 'toLogin',
            'click #button-new-user': 'toNewUser'
        },
        /**
         * @method toLogin
         * @param {Object} event
         */
        toLogin: function(event) {
            skritter.router.navigate('login', {trigger: true, replace: true});
            event.preventDefault();
        },
        /**
         * @method toNewUser
         * @param {Object} event
         */
        toNewUser: function(event) {
            skritter.router.navigate('user/new', {trigger: true, replace: true});
            event.preventDefault();
        }
    });
    
    return Home;
});