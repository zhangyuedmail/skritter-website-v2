/**
 * @module Skritter
 * @submodule View
 * @param templateAccount
 * @author Joshua McFarland
 */
define([
    'require.text!template/account.html'
], function(templateAccount) {
    /**
     * @class Account
     */
    var Account = Backbone.View.extend({
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
            document.title = "Skritter - Account";
            this.$el.html(templateAccount);
            var userName = skritter.user.settings.get('name');
            var userId = skritter.user.id;
            this.$('#user-name').text(skritter.user.settings.get('name'));
            if (userName !== userId) {
                this.$('#user-id').text('(' + userId + ')');
            }
            this.$('#user-avatar').html(skritter.user.settings.getAvatar('img-thumbnail'));
            this.$('#user-about-me').html(skritter.user.settings.get('aboutMe'));
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        }
    });
    
    return Account;
});