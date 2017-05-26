const BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class VocablistRemoveDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #confirm-btn': 'handleClickConfirmButton',
    'click #cancel-btn': 'handleClickCancelButton'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('dialogs/vocablist-remove/template'),

  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    this.vocablist = options.vocablist;

    if (!this.vocablist) {
      throw new Error('VocablistRemoveDialog requires a vocablist passed in!')
    }
  },

  /**
   * @method render
   * @returns {VocablistRemoveDialog}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method handleClickCloseButton
   * @param {Event} e
   */
  handleClickCancelButton: function(e) {
    this.close();
  },

  /**
   * @method handleClickSaveButton
   * @param {Event} e
   */
  handleClickConfirmButton: function(e) {
    this.vocablist.save({'studyingMode': 'not studying'}, {
      patch: true,
      method: 'PUT',
      success: () => {
        this.hideError();
        this.close();
      },
      error: (error) => {
        this.resetUI();
        this.showError('There was a problem deleting the list. Please try again.');
      }
    });

    this.$('.step-1').addClass('hidden');
    this.$('.modal-footer').addClass('hidden');
    this.$('.step-2').removeClass('hidden');
  },

  /**
   * Hides the error message from the user
   */
  hideError: function() {
    this.$('#error-msg').text('').addClass('hidden');
  },

  /**
   * Shows an error message to the user
   * @param {String} error the error message to show
   */
  showError: function(error) {
    this.$('#error-msg').text(error).removeClass('hidden');
  },

  /**
   * Resets the dialog to its initial state and hides any error messages
   */
  resetUI: function() {
    this.hideError();
    this.$('.modal-footer').removeClass('hidden');
    this.$('.step-1').removeClass('hidden');
    this.$('.step-2').addClass('hidden');
  }
});
