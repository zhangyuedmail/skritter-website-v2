/**
 * @module Skritter
 * @submodule View
 * @param templateTest
 * @author Joshua McFarland
 */
define([
    'require.text!template/test.html'
], function(templateTest) {
    /**
     * @class Test
     */
    var Test = Backbone.View.extend({
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            document.title = "Skritter - Test";
            this.$el.html(templateTest);
            require(['jasmine-boot'], function() {
                require([
                    //'specs/models/data/Item'
                ], function() {
                    window.runJasmine();
                });
            });
            return this;
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
    
    return Test;
});