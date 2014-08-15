/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "require.text!templates/admin-stroke.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewAdminStroke
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: "Stroke Editor",
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
