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
            this.$el.html(templateTest);
            require(['jasmine-boot'], function() {
                require([
                    //'specs/models/data/Item'
                ], function() {
                    window.runJasmine();
                });
            });
            return this;
        }
    });
    
    return Test;
});