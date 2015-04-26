/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoApplication',
    'modules/Router',
    'modules/data/Strokes',
    'modules/models/Api',
    'modules/models/MediaPlayer',
    'modules/models/User',
    'modules/utils/Functions'
], function(GelatoApplication, Router, Strokes, Api, MediaPlayer, User, Functions) {

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
            this.fn = Functions;
            this.strokes = Strokes;
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method start
         * @returns {Application}
         */
        start: function() {
            var self = this;
            this.api = new Api(null, {app: this});
            this.media = new MediaPlayer(null, {app: this});
            this.router = new Router({app: this});
            this.user = new User(null, {app: this});
            this.user.load(function() {
                self.router.start();
                //DEBUGGING: append app namespace to window
                if (gelato.isCordova() || gelato.isLocal()) {
                    window.app = self;
                }
            }, function(error) {
                console.error('USER LOAD ERROR:', error);
            });
            return this;
        }
    });

    return Application;

});