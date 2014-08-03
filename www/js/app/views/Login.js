/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "requirejs.text!templates/login.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewLogin
         * @extends GelatoView
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: "Login",
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
