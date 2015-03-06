/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoApplication',
    'modules/Functions',
    'modules/data/Strokes',
    'modules/models/Api',
    'modules/models/MediaPlayer',
    'modules/models/User'
], function(GelatoApplication, Functions, Strokes, Api, MediaPlayer, User) {

    /**
     * @class Application
     * @extends GelatoApplication
     */
    var Application = GelatoApplication.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.api = new Api();
            this.fn = Functions;
            this.media = new MediaPlayer();
            this.strokes = Strokes;
            this.user = new User();
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method isOnline
         * @param {Function} callback
         */
        isOnline: function(callback) {
            this.api.fetchDate(function(result) {
                callback(result.serverTime);
            }, function() {
                callback();
            });
        },
        /**
         * @method start
         */
        start: function() {
            var self = this;
            this.user.load(function() {
                self.router.start();
            }, function(error) {
                console.error('USER LOAD ERROR:', error);
            });
        }
    });

    return Application;

});