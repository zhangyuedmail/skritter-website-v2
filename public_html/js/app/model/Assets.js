/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Assets
     */
    var Assets = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.audio = new Audio();
            if (window.cordova) {
                navigator.expansion.load(this.get('cordovaMainVersion'), this.get('cordovaPatchVersion'));
            }
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            cordovaMainVersion: 3,
            cordovaPatchVersion: 1
        },
        /**
         * @method playAudio
         * @param {String} filename
         */
        playAudio: function(filename) {
            if (window.cordova) {
                navigator.expansion.media.play(window.decodeURIComponent(filename));
            } else {
                if (this.audio.paused) {
                    var url = skritter.api.root + skritter.api.tld + '/sounds?file=' + filename;
                    this.audio.src = url;
                    this.audio.play();
                }
            }
        },
        /**
         * @method getStroke
         * @param {Number} bitmapId
         * @param {String} color
         * @returns {CreateJS.Shape}
         */
        getStroke: function(bitmapId, color) {
            color = (color) ? color : '#000000';
            return skritter.fn.strokes[bitmapId](color);
        }
    });
    
    return Assets;
});