var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components1/marketing/footer/view');

/**
 * @class Institutions
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.footer = new MarketingFooter();
        this.navbar = new DefaultNavbar();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #purchase-license': 'handleClickRequestPurchase',
        'vclick #request-trial': 'handleClickRequestTrial',
        'vclick #request-submit': 'handleClickRequestSubmit'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Institutions - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Institutions}
     */
    render: function() {
        this.renderTemplate();
        this.footer.setElement('#footer-container').render();
        this.navbar.setElement('#navbar-container').render();
        this.$('#institution-datepicker').datetimepicker({format: 'YYYY-MM-DD'});
        return this;
    },
    /**
     * @method handleClickRequestPurchase
     * @param {Event} event
     */
    handleClickRequestPurchase: function(event) {
        event.preventDefault();
        var section = this.$('#section-request');
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
        this.disableForm('form');
        $.ajax({
            url: app.getApiUrl() + 'institution-contact',
            headers: app.user.session.getHeaders(),
            context: this,
            type: 'POST',
            data: JSON.stringify({
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
            })
        }).done(function() {
            this.$('#request-message').removeClass('text-danger');
            this.$('#request-message').addClass('text-success');
            this.$('#request-message').text('Your request has been successfully sent.');
            this.$('form').hide(500);
        }).error(function(error) {
            this.$('#request-message').removeClass('text-success');
            this.$('#request-message').addClass('text-danger');
            this.$('#request-message').text(JSON.stringify(error));
            this.enableForm('form');
        });
    },
    /**
     * @method handleClickRequestTrial
     * @param {Event} event
     */
    handleClickRequestTrial: function(event) {
        event.preventDefault();
        var section = this.$('#section-request');
        $('html, body').animate({scrollTop: section.offset().top}, 1000);
        this.$('#institution-request-type [value="trial"]').prop('checked', 'checked');
    },
    /**
     * @method remove
     * @returns {Institutions}
     */
    remove: function() {
        this.navbar.remove();
        this.footer.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
