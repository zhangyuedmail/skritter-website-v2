define([], function() {
    /**
     * @class Assets
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            if (window.cordova) {
                navigator.expansion.load(this.get('cordovaMainVersion'), this.get('cordovaPatchVersion'));
            } else {
                this.audio = new Audio();
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
        }
    });

    return Model;
});