/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/institutions.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageInstitutions
     * @extends GelatoPage
     */
    var PageInstitutions = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Institutions - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageInstitutions}
         */
        render: function() {
            this.renderTemplate(Template);
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
            $('html, body').animate({scrollTop: section.offset().top}, 1000);
            this.$('#institution-request-type [value="request-purchase"]').prop('checked', 'checked');
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
            this.$('#institution-request-type [value="request-trial"]').prop('checked', 'checked');
        }
    });

    return PageInstitutions;

});