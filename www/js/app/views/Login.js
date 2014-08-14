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
            var self = this;
            var password = this.elements.loginPassword.val();
            var username = this.elements.loginUsername.val();
            this.disableForm();
            this.elements.message.empty();
            app.dialog.show();
            app.dialog.element(".message-title").text("Logging In");
            app.user.login(username, password, function(data, status) {
                if (status === 200) {
                    location.href = "";
                } else {
                    app.dialog.hide();
                    self.elements.message.text(data.responseJSON.message);
                    self.enableForm();
                }
            });
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
