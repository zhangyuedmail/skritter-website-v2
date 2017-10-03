let BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class CancelSubscriptionDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #go-on-vacation-link': 'handleClickGoOnVacationLink',
    'click #submit-btn': 'handleClickSubmitButton',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    this.choseVacation = false;
    this.subscription = options.subscription;
  },

  /**
   * @method render
   * @returns {ListSettingsDialog}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method handleClickGoOnVacationLink
   */
  handleClickGoOnVacationLink: function() {
    this.choseVacation = true;
    this.close();
  },

  /**
   * @method handleClickSubmitButton
   */
  handleClickSubmitButton: function() {
    let service = this.subscription.get('subscribed');

    if (!_.includes(['stripe', 'gplay'], service)) {
      return false;
    }

    $.when(
      this.requestUnsubscribe(),
      this.requestUpdateReceiveNewsletter()
    ).done(function() {
      if (app.user.getAccountAgeBy('days') > 7) {
        app.mixpanel.track('Unsubscribe', {'Trial': false});
      } else {
        app.mixpanel.track('Unsubscribe', {'Trial': true});
      }
      app.reload();
    });
  },

  /**
   * @method requestUnsubscribe
   * @return {jqxhr}
   */
  requestUnsubscribe: function() {
    let service = this.subscription.get('subscribed');
    let url = app.getApiUrl() + this.subscription.url() + '/' + service + '/cancel';
    let headers = app.user.session.getHeaders();
    this.$('#submit-btn *').toggleClass('hide');

    return $.ajax({
      url: url,
      headers: headers,
      method: 'POST',
    });
  },

  /**
   * @method requestUpdateReceiveNewsletter
   */
  requestUpdateReceiveNewsletter: function() {
    let input = this.$('#receive-newsletters');
    let receiveNewsletters = input.is(':checked');

    if (receiveNewsletters === app.user.get('allowEmailsFromSkritter')) {
      return;
    }

    let attrs = {
      id: app.user.id,
      allowEmailsFromSkritter: receiveNewsletters,
    };
    let options = {
      patch: true,
      method: 'PUT',
    };

    return app.user.save(attrs, options);
  },
});
