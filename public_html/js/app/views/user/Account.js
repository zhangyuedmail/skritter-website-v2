/**
 * @module Skritter
 * @submodule Views
 * @param templateUserAccount
 * @author Joshua McFarland
 */
define([
    'require.text!templates/user-account.html'
], function(templateUserAccount) {
    /**
     * @class UserAccount
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
            this.$el.html(templateUserAccount);
            return this;
        }
    });
    
    return Account;
});