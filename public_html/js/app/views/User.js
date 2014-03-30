/**
 * @module Skritter
 * @submodule Views
 * @param templateUser
 * @author Joshua McFarland
 */
define([
    'require.text!templates/user.html'
], function(templateUser) {
    /**
     * @class User
     */
    var User = Backbone.View.extend({
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
            this.$el.html(templateUser);
            return this;
        }
    });
    
    return User;
});