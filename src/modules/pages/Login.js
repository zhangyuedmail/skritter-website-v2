/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/login.html',
    'core/modules/GelatoPage',
    'modules/components/Footer'
], function(Template, GelatoPage, Footer) {

    /**
     * @class PageLogin
     * @extends GelatoPage
     */
    var PageLogin = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.footer = new Footer();
        },
        /**
         * @property title
         * @type String
         */
        title: 'Login - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageLogin}
         */
        render: function() {
            this.renderTemplate(Template);
            this.footer.setElement(this.$('#footer-container')).render();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick #login-submit': 'handleClickLoginSubmit'
        },
        /**
         * @method handleClickLoginSubmit
         * @param {Event} event
         */
        handleClickLoginSubmit: function(event) {
            event.preventDefault();
            var self = this;
            var fieldUsername = this.$('#login-username').val();
            var fieldPassword = this.$('#login-password').val();
            if (!fieldUsername) {
                this.$('#response-message').text('Username is required.');
                return;
            }
            if (!fieldPassword) {
                this.$('#response-message').text('Password is required.');
                return;
            }
            this.disableForm('#login-form');
            app.dialog.show('loading');
            app.user.login(fieldUsername, fieldPassword, function() {
                app.dialog.once('hidden', app.reload);
                app.dialog.hide();
            }, function(error) {
                self.$('#response-message').text(JSON.stringify(error));
                self.enableForm('#login-form');
                app.dialog.hide();
            }, function(status) {
                self.$('.loaded-items').text(status);
            });
        },
        /**
         * @method remove
         * @returns {PageHome}
         */
        remove: function() {
            this.footer.remove();
            return GelatoPage.prototype.remove.call(this);
        }
    });

    return PageLogin;

});