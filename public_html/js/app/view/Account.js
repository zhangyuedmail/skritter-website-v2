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