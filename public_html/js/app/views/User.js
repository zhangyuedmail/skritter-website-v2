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
            User.id = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateUser);
            skritter.api.getUser(User.id, _.bind(function(user) {
                this.$('#user-username').text(user.name);
                this.$('#user-avatar').html("<img src='data:image/png;base64," + user.avatar + "' + class='img-circle' />");
                this.$('#user-about-me').html(user.aboutMe);
            }, this));
            return this;
        },
        /**
         * @method load
         */
        load: function() {
            
        },
        /**
         * @method set
         * @param {String} id
         * @returns {Backbone.View}
         */
        set: function(id) {
            User.id = id;
            return this;
        }
    });
    
    return User;
});