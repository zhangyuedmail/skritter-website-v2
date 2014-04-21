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
        },
        /**
         * @method playAudio
         * @param {String} filename
         */
        playAudio: function(filename) {
            if (window.cordova) {
                //TODO: impement a better plugin for dealing with expansion file audio
            } else {
                if (this.audio.paused) {
                    this.audio.src = skritter.api.root + skritter.api.tld + '/sounds?file=' + filename;
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