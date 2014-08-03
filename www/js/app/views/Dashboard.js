/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "requirejs.text!templates/dashboard.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewDashboard
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {},
        /**
         * @method render
         * @returns {GelatoPage}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        }
    });
});
