/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "require.text!templates/dashboard.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewDashboard
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: "Dashboard",
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
