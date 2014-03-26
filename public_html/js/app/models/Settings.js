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
                window.setTimeout(_.bind(function() {
                    this.trigger('resize', this);
                }, this), 500);
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
            hintColor: '#87cefa',
            language: '@@language',
            maxCanvasSize: 600,
            version: '@@version'
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
        },
        /**
         * @method language
         * @returns {String}
         */
        language: function() {
            if (this.get('language') === '@@version')
                return skritter.user.setting.get('targetLang');
            return this.get('language');
        }
    });
    
    return Settings;
});