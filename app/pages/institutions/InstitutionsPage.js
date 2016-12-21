const GelatoPage = require('gelato/page');

/**
 * @class InstitutionsPage
 * @extends {GelatoPage}
 */
const InstitutionsPage = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #purchase-license': 'handleClickRequestPurchase',
    'click #request-trial': 'handleClickRequestTrial',
    'click #request-submit': 'handleClickRequestSubmit'
  },

  /**
   * Describes a CSS class name for what type of background this page should have.
   * The class is applied higher up in the hierarchy than the page element.
   * @type {String}
   */
  background: 'marketing',

  /**
   * @property title
   * @type {String}
   */
  title: 'Institutions - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Institutions'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    app.mixpanel.track('Viewed institutions page');
  },

  /**
   * @method render
   * @returns {InstitutionsPage}
   */
  render: function() {
    this.renderTemplate();
    this.$('#institution-when').daterangepicker({
      locale: {format: 'YYYY-MM-DD'},
      singleDatePicker: true,
      startDate: moment()
    });

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
    var self = this;
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
    }).then(function() {
      self.$('#request-message').removeClass('text-danger');
      self.$('#request-message').addClass('text-success');
      self.$('#request-message').text('Your request has been successfully sent.');
      self.$('form').hide(500);
    }).error(function(error) {
      self.$('#request-message').removeClass('text-success');
      self.$('#request-message').addClass('text-danger');
      self.$('#request-message').text(JSON.stringify(error));
      self.enableForm('form');
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
  }
});

module.exports = InstitutionsPage;
