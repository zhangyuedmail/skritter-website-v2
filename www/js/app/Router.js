/**
 * @module Application
 */
define([
    "framework/GelatoRouter",
    "app/views/Home"
], function(GelatoRouter, HomeView) {
    /**
     * @class Router
     * @extend GelatoRouter
     */
    return GelatoRouter.extend({
        /**
         * @property routes
         * @type Object
         */
        routes: {
            "": "showHome"
        },
        /**
         * @method showHome
         */
        showHome: function() {
            this.currentView = new HomeView();
            this.currentView.render();
        }
    });
});
