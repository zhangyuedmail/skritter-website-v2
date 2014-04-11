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
            maxCanvasSize: 800,
            storageType: 'IndexedDB',
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
            var size = 0;
            if (this.isPortrait()) {
                if (this.contentWidth() > this.get('maxCanvasSize')) {
                    size = this.get('maxCanvasSize');
                } else {
                    size = this.contentWidth();
                }
            } else {
                size = this.contentWidth() / 2;
            }
            return size;
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
         * @method isIndexedDB
         * @returns {Boolean}
         */
        isIndexedDB: function() {
            if (this.get('storageType') === 'IndexedDB')
                return true;
            return false;
        },
        /**
         * @method isLandscape
         * @returns {Boolean}
         */
        isLandscape: function() {
            if (this.contentWidth() >= this.contentHeight())
                return true;
            return false;
        },
        /**
         * @method isPortrait
         * @returns {Boolean}
         */
        isPortrait: function() {
            if (this.contentWidth() < this.contentHeight())
                return true;
            return false;
        },
        /**
         * @method language
         * @returns {String}
         */
        language: function() {
            var language = this.get('language');
            if (language === 'zh' || language === 'ja')
                return language;
            return skritter.user.settings.get('targetLang');
        }
    });
    
    return Settings;
});