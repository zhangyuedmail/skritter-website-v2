/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Settings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            container: $('#skritter-container'),
            navbar: $('.navbar')
        }
    });
    
    return Settings;
});