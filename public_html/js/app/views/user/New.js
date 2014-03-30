/**
 * @module Skritter
 * @submodule Views
 * @param templateUserNew
 * @author Joshua McFarland
 */
define([
    'require.text!templates/user-new.html'
], function(templateUserNew) {
    /**
     * @class UserNew
     */
    var UserNew = Backbone.View.extend({
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
            this.$el.html(templateUserNew);
            return this;
        }
    });
    
    return UserNew;
});