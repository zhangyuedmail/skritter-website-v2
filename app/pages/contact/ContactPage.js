const GelatoPage = require('gelato/page');

/**
 * @class ContactPage
 * @extends {GelatoPage}
 */
const ContactPage = GelatoPage.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #contact-submit': 'handleClickContactSubmit',
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
  title: 'Contact - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Contact'),

  /**
   * @method render
   * @returns {ContactPage}
   */
  render: function() {
    this.renderTemplate();
    if (app.user.isLoggedIn()) {
      this.$('#field-email').val(app.user.get('email'));
    }

    return this;
  },

  /**
   * @method getFormData
   * @returns {Object}
   */
  getFormData: function() {
    return {
      email: this.$('#field-email').val(),
      message: this.$('#field-message').val(),
      subject: this.$('#field-topic').val(),
    };
  },

  /**
   * @method handleClickContactSubmit
   * @param {Event} event
   */
  handleClickContactSubmit: function(event) {
    event.preventDefault();
    let formData = this.getFormData();
    if (_.isEmpty(formData.email)) {
      this.$('#contact-message').removeClass();
      this.$('#contact-message').addClass('text-danger');
      this.$('#contact-message').text('Please enter a valid e-mail address.');
      return;
    }
    if (_.isEmpty(formData.message)) {
      this.$('#contact-message').removeClass();
      this.$('#contact-message').addClass('text-danger');
      this.$('#contact-message').text('Message field can\'t be blank.');
      return;
    }
    this.disableForm('form');
    $.ajax({
      url: app.getApiUrl() + 'feedback',
      headers: app.user.session.getHeaders(),
      context: this,
      type: 'POST',
      data: JSON.stringify(formData),
      success: () => {
        this.$('#contact-message').removeClass();
        this.$('#contact-message').addClass('text-success');
        this.$('#contact-message').text('Your feedback has been successfully submitted.');
        this.$('form').hide(500);
      },
      error: (error) => {
        this.$('#contact-message').removeClass();
        this.$('#contact-message').addClass('text-danger');
        this.$('#contact-message').text(JSON.stringify(error));
        this.enableForm('form');
      },
    });
  },

  /**
   * @method remove
   * @returns {ContactPage}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  },

});

module.exports = ContactPage;
