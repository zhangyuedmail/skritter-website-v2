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
        home: function() {
            this.view = new Home({el: this.container});
            this.view.render();
        },
        login: function() {
            this.view = new Login({el: this.container});
            this.view.render();
        },
        test: function() {
            this.view = new Test({el: this.container});
            this.view.render();
        }
    });

    return Router;
});