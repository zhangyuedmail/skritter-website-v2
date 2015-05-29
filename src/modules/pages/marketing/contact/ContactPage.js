/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/contact/contact-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template, 
    GelatoPage, 
    FooterComponent
) {

    /**
     * @class ContactPage
     * @extends GelatoPage
     */
    var ContactPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.footer = new FooterComponent();
        },
        /**
         * @property title
         * @type String
         */
        title: 'Contact - ' + i18n.global.title,
        /**
         * @method render
         * @returns {ContactPage}
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
            'vclick #contact-submit': 'handleClickContactSubmit'
        },
        /**
         * @method handleClickContactSubmit
         * @param {Event} event
         */
        handleClickContactSubmit: function(event) {
            event.preventDefault();
            var self = this;
            var email = this.$('#contact-email').val();
            var message = this.$('#contact-message').val();
            var subject = this.$('#contact-topic-select').val();
            if (!email) {
                this.$('#status-message').removeClass();
                this.$('#status-message').addClass('text-danger');
                this.$('#status-message').text('Please enter a valid e-mail address.');
                return;
            }
            if (!message) {
                this.$('#status-message').removeClass();
                this.$('#status-message').addClass('text-danger');
                this.$('#status-message').text("Message field can't be blank.");
                return;
            }
            this.disableForm('form');
            app.api.postContact('feedback', {
                email: email,
                message: message,
                subject: subject
            }, function() {
                self.$('#status-message').removeClass();
                self.$('#status-message').addClass('text-success');
                self.$('#status-message').text('Your feedback has been successfully submitted.');
                self.$('form').hide(500);
            }, function(error) {
                self.$('#status-message').removeClass();
                self.$('#status-message').addClass('text-danger');
                self.$('#status-message').text(JSON.stringify(error));
                self.enableForm('form');
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

    return ContactPage;

});