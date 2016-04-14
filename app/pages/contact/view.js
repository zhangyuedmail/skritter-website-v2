var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components/marketing/footer/view');

/**
 * @class Contact
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
   * @type Object
   */
  events: {
    'click #contact-submit': 'handleClickContactSubmit'
  },
  /**
   * @property title
   * @type {String}
   */
  title: 'Contact - Skritter',
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {Contact}
   */
  render: function() {
    this.renderTemplate();
    if (app.user.isLoggedIn()) {
      this.$('#field-email').val(app.user.get('email'));
    }
    this.footer.setElement('#footer-container').render();
    this.navbar.setElement('#navbar-container').render();
    return this;
  },
  /**
   * @method handleClickContactSubmit
   * @param {Event} event
   */
  handleClickContactSubmit: function(event) {
    event.preventDefault();
    var email = this.$('#field-email').val();
    var message = this.$('#field-message').val();
    var subject = this.$('#field-topic').val();
    if (!email) {
      this.$('#contact-message').removeClass();
      this.$('#contact-message').addClass('text-danger');
      this.$('#contact-message').text('Please enter a valid e-mail address.');
      return;
    }
    if (!message) {
      this.$('#contact-message').removeClass();
      this.$('#contact-message').addClass('text-danger');
      this.$('#contact-message').text("Message field can't be blank.");
      return;
    }
    this.disableForm('form');
    $.ajax({
      url: app.getApiUrl() + 'feedback',
      headers: app.user.session.getHeaders(),
      context: this,
      type: 'POST',
      data: JSON.stringify({
        email: email,
        message: message,
        subject: subject
      })
    }).done(function() {
      this.$('#contact-message').removeClass();
      this.$('#contact-message').addClass('text-success');
      this.$('#contact-message').text('Your feedback has been successfully submitted.');
      this.$('form').hide(500);
    }).error(function(error) {
      this.$('#contact-message').removeClass();
      this.$('#contact-message').addClass('text-danger');
      this.$('#contact-message').text(JSON.stringify(error));
      this.enableForm('form');
    });
  },
  /**
   * @method remove
   * @returns {Contact}
   */
  remove: function() {
    this.navbar.remove();
    this.footer.remove();
    return GelatoPage.prototype.remove.call(this);
  }
});
