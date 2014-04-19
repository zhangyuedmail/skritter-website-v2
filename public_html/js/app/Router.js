/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'view/Home',
    'view/Login',
    'view/Test'
], function(Home, Login, Test) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.container = $('#skritter-container');
            this.view = null;
            Backbone.history.start();
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'home',
            'login': 'login',
            'test': 'test'
        },
        /**
         * @method removeView
         */
        removeView: function() {
            if (this.view)
                this.view.remove();
            this.view = null;
        },
        /**
         * @method home
         */
        home: function() {
            this.removeView();
            this.view = new Home({el: this.container});
            this.view.render();
        },
        /**
         * @method login
         */
        login: function() {
            this.removeView();
            this.view = new Login({el: this.container});
            this.view.render();
        },
        /**
         * @method test
         */
        test: function() {
            this.removeView();
            this.view = new Test({el: this.container});
            this.view.render();
        }
    });

    return Router;
});