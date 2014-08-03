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
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: "Log In",
        /**
         * @method render
         * @returns {GelatoPage}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: function(){
            return _.extend({}, GelatoPage.prototype.events, {
                "keyup #login-password": "handleKeyUp",
                "vclick #button-login": "handleClickLogin",
                "vclick #button-new": "handleClickRegister"
            });
        },
        /**
         * @method handleClickLogin
         * @param {Event} event
         */
        handleClickLogin: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickRegister
         * @param {Event} event
         */
        handleClickRegister: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleKeyUp
         * @param {Object} event
         */
        handleKeyUp: function(event) {
            if (event.keyCode === 13) {
                this.handleClickLogin(event);
            } else {
                event.preventDefault();
            }
        }
    });
});
