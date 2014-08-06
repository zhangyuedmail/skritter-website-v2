/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "require.text!templates/about.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewAbout
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: "About",
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
