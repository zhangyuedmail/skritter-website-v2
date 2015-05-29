/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoApplication',
    'modules/Router',
    'modules/data/StrokeData',
    'modules/data/TutorialData',
    'modules/collections/TutorialCollection',
    'modules/models/Api',
    'modules/models/MediaPlayer',
    'modules/models/User',
    'modules/utils/Functions'
], function(
    GelatoApplication,
    Router,
    StrokeData,
    TutorialData,
    TutorialCollection,
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
            this.strokes = StrokeData;
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
            this.tutorials = new TutorialCollection(TutorialData.getData());
            this.user = new User();
            this.user.load(function() {
                console.log('USER:', self.user.id);
                self.router.start();
            }, function(error) {
                console.error('USER LOAD ERROR:', error);
            });
            return this;
        }
    });

    return Application;

});