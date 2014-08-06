/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "require.text!templates/login.html"
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
            this.elements.loginPassword = this.$("#login-password");
            this.elements.loginUsername = this.$("#login-username");
            this.elements.message = this.$("#message");
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
            var password = this.elements.loginPassword.val();
            var username = this.elements.loginUsername.val();
            this.disableForm();
            this.elements.message.empty();
            app.user.login(username, password, _.bind(function(data, status) {
                if (status === 200) {
                    app.router.navigate("", {replace: true});
                    location.reload(true);
                } else {
                    this.elements.message.html(data.message);
                    this.enableForm();
                }
            }, this));
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
