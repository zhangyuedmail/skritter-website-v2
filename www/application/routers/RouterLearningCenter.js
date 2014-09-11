/**
 * @module Application
 */
define([
    'framework/BaseRouter'
], function(BaseRouter) {
    /**
     * @class RouterLearningCenter
     * @extends BaseRouter
     */
    var RouterLearningCenter = BaseRouter.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property routes
         * @type Object
         */
        routes: {}
    });

    return RouterLearningCenter;
});
