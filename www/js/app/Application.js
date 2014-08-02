/**
 * @module Application
 */
define([
    "framework/GelatoApplication",
    "framework/GelatoDialog",
    "framework/GelatoSidebar"
], function(GelatoApplication, GelatoDialog, GelatoSidebar) {
    return GelatoApplication.extend({
        /**
         * @class Application
         * @extends GelatoApplication
         * @constructor
         */
        initialize: function() {
            this.dialog = new GelatoDialog();
            this.sidebar = new GelatoSidebar();
        }
    });
});