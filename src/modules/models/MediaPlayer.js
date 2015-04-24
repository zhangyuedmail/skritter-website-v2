/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class MediaPlayer
     * @extends GelatoModel
     */
    var MediaPlayer = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.app = options.app;
            this.audio = new Audio();
        },
        /**
         * @method play
         * @param {String} src
         * @returns {MediaPlayer}
         */
        play: function(src) {
            if (this.audio.paused) {
                this.set('url', src);
                this.audio.src = src;
                this.audio.play();
            }
            return this;
        }
    });

    return MediaPlayer;

});