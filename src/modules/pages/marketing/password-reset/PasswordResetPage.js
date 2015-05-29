/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/password-reset/password-reset-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template,
    GelatoPage,
    Footer
) {

    /**
     * @class PasswordResetPage
     * @extends GelatoPage
     */
    var PasswordResetPage = GelatoPage.extend({
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
        title: 'Password Reset - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PasswordResetPage}
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
            'vclick #reset-submit': 'handleClickResetSubmit'
        },
        /**
         * @method handleClickResetSubmit
         * @param {Event} event
         */
        handleClickResetSubmit: function(event) {
            event.preventDefault();
            var fieldEmail = this.$('#login-email').val();
            if (!fieldEmail) {
                this.$('#response-message').text('Username or email is required for password reset.');
                return;
            }
            this.disableForm('#login-form');
            app.api.resetPassword(fieldEmail, function() {
                self.$('#response-message').removeClass('text-danger');
                self.$('#response-message').addClass('text-success');
                self.$('#response-message').text('Password sent.');
            }, function(error) {
                self.$('#response-message').removeClass('text-success');
                self.$('#response-message').addClass('text-danger');
                if (error.status === 300) {
                    self.$('#response-message').text(error.responseJSON.choices.join(', '));
                } else {
                    self.$('#response-message').text(JSON.stringify(error));
                }
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

    return PasswordResetPage;

});