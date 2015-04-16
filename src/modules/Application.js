/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoApplication',
    'core/modules/GelatoDialog',
    'core/modules/GelatoSidebar',
    'modules/Router',
    'modules/data/Strokes',
    'modules/models/Api',
    'modules/models/MediaPlayer',
    'modules/models/User',
    'modules/utils/Functions'
], function(GelatoApplication, GelatoDialog, GelatoSidebar, Router, Strokes, Api, MediaPlayer, User, Functions) {

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
            this.dialog = new GelatoDialog();
            this.fn = Functions;
            this.media = new MediaPlayer();
            this.router = new Router();
            this.sidebar = new GelatoSidebar();
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