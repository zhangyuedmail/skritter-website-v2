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
            $(window).resize(_.bind(function(event) {
                this.trigger('resize', this);
                event.preventDefault();
            }, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            gradingColors: {
                1: '#f7977a',
                2: '#fff79a',
                3: '#82ca9d',
                4: '#8493ca'
            },
            maxCanvasSize: 600
        },
        /**
         * @method appHeight
         * @returns {Number}
         */
        appHeight: function() {
            return $(window).height();
        },
        /**
         * @method appWidth
         * @returns {Number}
         */
        appWidth: function() {
            return $(window).width();
        },
        /**
         * @method canvasSize
         * @returns {Number}
         */
        canvasSize: function() {
            if (this.contentWidth() > this.get('maxCanvasSize'))
                return this.get('maxCanvasSize');
            return this.contentWidth();
        },
        /**
         * @method contentHeight
         * @returns {Number}
         */
        contentHeight: function() {
            return $('#content-container').height();
        },
        /**
         * @method contentWidth
         * @returns {Number}
         */
        contentWidth: function() {
            return $('#content-container').width();
        }
    });
    
    return Settings;
});