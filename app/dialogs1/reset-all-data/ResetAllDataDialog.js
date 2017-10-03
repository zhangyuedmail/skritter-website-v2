const GelatoDialog = require('base/gelato-dialog');

/**
 * A dialog that confirms whether a user wants to reset their data for
 * a target language. Calls necessary APIs to perform reset an account's data.
 * @class ResetAllDataDialog
 * @extends {GelatoDialog}
 */
const ResetAllDataDialog = GelatoDialog.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-cancel': 'handleClickButtonCancel',
    'click #button-confirm': 'handleClickButtonConfirm',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./ResetAllData.jade'),

  /**
   * @method render
   * @returns {ResetAllDataDialog}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method handleClickButtonCancel
   * @param {Event} event
   */
  handleClickButtonCancel: function(event) {
    event.preventDefault();
    this.close();
  },

  /**
   * Gets the password entered, and attempts to reset the user's
   * @method handleClickButtonConfirm
   * @param {Event} event
   */
  handleClickButtonConfirm: function(event) {
    event.preventDefault();
    ScreenLoader.show();
    ScreenLoader.post('Resetting account data');
    const password = this.$('#input-password').val();

    this.resetV1Data(password)

    // this is done on server-side now
    // .then(this.resetV2Data, (error) => {this.handleResetError(error);})
      .then(() => {
        app.user.setLastItemUpdate(0);
        app.user.cache();
        app.router.navigate('dashboard');
        app.reload();
    }, (error) => {
this.handleResetError(error);
});
  },

  /**
   * Handles when there's an error resetting a user's account
   * @param {Object} error
   */
  handleResetError: function(error) {
    ScreenLoader.hide();
    this.$('#error-message').text(error);
  },

  /**
   * Resets a user's account data for the current language
   * @param {String} password the user's password, used to verify/confirm
   *                          the user *really* wants to do this
   * @return {Promise}
   */
  resetV1Data: function(password) {
    return new Promise((resolve, reject) => {
      $.ajax({
        data: {
          lang: app.getLanguage(),
          password,
        },
        headers: app.user.session.getHeaders(),
        type: 'POST',
        url: app.getApiUrl() + 'reset',
        error: function(error) {
          reject(error.responseJSON ? error.responseJSON.message : app.locale('pages.account.errorResetGeneral'));
        },
        success: function() {
          resolve();
        },
      });
    });
  },

  /**
   * Calls the reset route on the v2 API to confirm that all the proper data
   * was updated
   * @return {Promise}
   */
  resetV2Data: function() {
    return new Promise((resolve, reject) => {
      $.ajax({
        data: {
          lang: app.getLanguage(),
        },
        headers: app.user.session.getHeaders(),
        type: 'POST',
        url: app.getApiUrl(2) + 'gae/account/reset',
        error: function(error) {
          reject(error.responseJSON ? error.responseJSON.message : app.locale('pages.accountGeneral.errorResetGeneral'));
        },
        success: function() {
          resolve();
        },
      });
    });
  },
});

module.exports = ResetAllDataDialog;
