const GelatoComponent = require('gelato/component');

/**
 * Component where the user can enter feedback and send it to the team.
 * @class FeedbackComponent
 * @extends {GelatoComponent}
 */
const FeedbackComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #send-feedback': 'onSendFeedbackClicked'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Feedback'),

  initialize: function(options) {
    this.dialog = options.dialog;
  },

  /**
   * @method render
   * @returns {FeedbackComponent}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * Resets the dialog and displays a success/thank you message
   * to the user for giving feedback.
   */
  feedbackSubmittedSuccess: function() {
    this.resetView();
    if (this.dialog) {
      this.dialog.close();

      let thanks = '谢谢';
      if (app.isJapanese()) {
        thanks = 'ありがとうございます！';
      } else if (app.user.get('addTraditional') && app.user.get('reviewTraditional')) {
          thanks = '謝謝!';
      }

      $.notify(
        {
          message: 'Feedback successfully sent! ' + thanks
        },
        {
          type: 'pastel-success',
          animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
          },
          delay: 5000,
          icon_type: 'class'
        }
      );
    }
  },

  /**
   * Shows an error message to the user in the component when there was
   * a problem sending the feedback.
   */
  feedbackSubmittedError: function() {
    this.resetView();
    this.showError('There was a problem on our end saving the feedback. Please try again.');
  },

  /**
   * Handles user clicking the send button. Validates the data, and if valid,
   * kicks off a function to save the feedback.
   */
  onSendFeedbackClicked: function() {
    const feedbackText = this.$('textarea').val().trim();
    const userId = app.user.id;
    const displayName = app.user.get('name');
    const email = app.user.get('email');
    const page = window.location.pathname;

    if (_.isEmpty(feedbackText)) {
      this.resetView();
      this.showError('You need to leave us some feedback first!');
      return;
    }

    this.$('#error-msg').addClass('hidden');

    this.$('#send-feedback')
      .prop('disabled', true)
      .text('Sending...');

    this.$('textarea').prop('disabled', true);

    this.sendFeedback(feedbackText, userId, displayName, email, page);
  },

  /**
   * Resets (re-enables) all buttons, messages, and inputs to their initial state
   */
  resetView: function() {
    this.$('#error-msg').addClass('hidden');

    this.$('#send-feedback')
      .prop('disabled', false)
      .text('Send Feedback');

    this.$('textarea').prop('disabled', false);
  },

  /**
   * Submits a request to save user feedback
   * @param {String} feedbackText the user's feedback
   * @param {String} userId the user's id
   * @param {String} displayName the user's display name
   * @param {String} email the user's email address
   * @param {String} page the page the user was on when the request was submitted.
   */
  sendFeedback: function(feedbackText, userId, displayName, email, page) {
    const self = this;
    const feedbackData = {
      email: email,
      subject: 'Feedback',
      message: 'Feedback widget feedback!\nUser ' + userId + ' (' + displayName + '), email: ' + email +
        ' while studying ' + app.getLanguage() + ' on the page ' + page + " left us the following feedback:\n" + feedbackText
    };

    $.ajax({
      url: app.getApiUrl() + 'feedback',
      headers: app.user.session.getHeaders(),
      context: this,
      type: 'POST',
      data: JSON.stringify(feedbackData),
      success: function() {
        self.feedbackSubmittedSuccess();
      },
      error: function() {
        self.feedbackSubmittedError();
      }
    });
  },

  showError: function(msg) {
    this.$('#error-msg').text(msg).removeClass('hidden');
  }

});

module.exports = FeedbackComponent;
