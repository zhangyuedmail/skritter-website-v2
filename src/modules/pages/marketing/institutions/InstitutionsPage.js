/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/institutions/institutions-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template, 
    GelatoPage, 
    Footer
) {

    /**
     * @class InstitutionsPage
     * @extends GelatoPage
     */
    var InstitutionsPage = GelatoPage.extend({
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
        title: 'Institutions - ' + i18n.global.title,
        /**
         * @method render
         * @returns {InstitutionsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.footer.setElement(this.$('#footer-container')).render();
            this.$('#institution-datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {
            'vclick .request-purchase': 'handleClickRequestPurchase',
            'vclick .request-trial': 'handleClickRequestTrial',
            'vclick #request-submit': 'handleClickRequestSubmit'
        },
        /**
         * @method handleClickRequestPurchase
         * @param {Event} event
         */
        handleClickRequestPurchase: function(event) {
            event.preventDefault();
            var section = this.$("#section-request");
            var students = $(event.currentTarget).data('students');
            $('html, body').animate({scrollTop: section.offset().top}, 1000);
            this.$('#institution-request-type [value="purchase"]').prop('checked', 'checked');
            this.$('#institution-number option[value="' + students + '"]').prop('selected', 'selected');
        },
        /**
         * @method handleClickRequestSubmit
         * @param {Event} event
         */
        handleClickRequestSubmit: function(event) {
            event.preventDefault();
            var email = this.$('#institution-contact-email').val();
            var language = this.$('#institution-language option:selected').text();
            var message = this.$('#institution-message').val();
            var name = this.$('#institution-contact-name').val();
            var requestType = this.$('#institution-request-type [name="request-type"]:checked').val();
            var schoolAddress = this.$('#institution-address').val();
            var schoolName = this.$('#institution-name').val();
            var schoolType = this.$('#institution-type option:selected').text();
            var schoolStudents = this.$('#institution-number option:selected').text();
            var when = this.$('#institution-when').val();
            app.api.postContact('institution-contact', {
                email: email,
                message: message,
                schoolInfo: {
                    'Request Type': requestType,
                    'Organization Name': schoolName,
                    'Organization Type': schoolType,
                    'Number of students': schoolStudents,
                    'Language': language,
                    'Contact Name': name,
                    'Contact Email': email,
                    'Organization Address': schoolAddress,
                    'Start Date': when
                }
            }, function() {
                self.$('#status-message').removeClass();
                self.$('#status-message').addClass('text-success');
                self.$('#status-message').text('Your request has been successfully sent.');
                self.$('form').hide(500);
            }, function(error) {
                self.$('#status-message').removeClass();
                self.$('#status-message').addClass('text-danger');
                self.$('#status-message').text(JSON.stringify(error));
                self.enableForm('form');
            });
        },
        /**
         * @method handleClickRequestTrial
         * @param {Event} event
         */
        handleClickRequestTrial: function(event) {
            event.preventDefault();
            var section = this.$("#section-request");
            $('html, body').animate({scrollTop: section.offset().top}, 1000);
            this.$('#institution-request-type [value="trial"]').prop('checked', 'checked');
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

    return InstitutionsPage;

});