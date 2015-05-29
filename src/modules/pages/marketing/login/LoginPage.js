/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/login/login-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template, 
    GelatoPage, 
    Footer
) {

    /**
     * @class LoginPage
     * @extends GelatoPage
     */
    var LoginPage = GelatoPage.extend({
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
         * @returns {LoginPage}
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
            app.dialogs.open('loading');
            app.user.login(fieldUsername, fieldPassword, function() {
                app.dialogs.once('hidden', app.reload);
                app.dialogs.close();
            }, function(error) {
                self.$('#response-message').text(JSON.stringify(error));
                self.enableForm('#login-form');
                app.dialogs.close();
            });
        },
        /**
         * @method remove
         * @returns {LoginPage}
         */
        remove: function() {
            this.footer.remove();
            return GelatoPage.prototype.remove.call(this);
        }
    });

    return LoginPage;

});