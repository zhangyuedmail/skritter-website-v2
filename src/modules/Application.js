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
], function(
    GelatoApplication,
    Router,
    Strokes,
    Api,
    MediaPlayer,
    User,
    Functions
) {

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
            this.api = new Api();
            this.media = new MediaPlayer();
            this.router = new Router();
            this.user = new User();
            this.user.load(function() {
                self.router.start();
            }, function(error) {
                console.error('USER LOAD ERROR:', error);
            });
            return this;
        }
    });

    return Application;

});