var GelatoPage = require('gelato/page');
var Vocablist = require('models/VocablistModel');

/**
 * @class NewVocablistPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'submit #new-list-form': 'handleSubmitNewListForm'
  },

  /**
   * @property title
   * @type {String}
   */
  title: 'Create Vocablist - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsCreate'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.vocablist = new Vocablist();
    this.errorMessage = '';
  },

  /**
   * @method render
   * @returns {NewVocablistPage}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * Sets the list's attributes, validates them, and disables inputs while saving.
   * @method handleSubmitNewListForm
   * @param {Event} event
   */
  handleSubmitNewListForm: function(event) {
    event.preventDefault();
    this.errorMessage = '';
    this.vocablist.set({
      name: this.$('#name').val().trim(),
      description: this.$('#description').val(),
      sections: [{name: 'Section 1', rows: []}],
      singleSect: false,
      lang: app.getLanguage()
    });

    if (!this.validateListAttrs()) {
      this.render();
      return;
    } else {
      this.$('.alert-danger').addClass('hidden');
    }

    this.toggleInputs();

    this.listenToOnce(this.vocablist, 'sync', function() {
      this.onVocablistSaved();
    });
    this.listenToOnce(this.vocablist, 'error', function(model, jqxhr) {
      this.errorMessage = jqxhr.responseJSON.message;
      this.stopListening(this.vocablist);
      this.toggleInputs(true);
    });

    this.vocablist.save();
  },

  /**
   * Navigates the user to edit their new vocab list on a successful save.
   */
  onVocablistSaved: function() {
    let sect = this.vocablist.get('sections');
    if (sect && sect[0] && sect[0].id) {
      sect = sect[0].id;
    }

    app.router.navigateVocablist(this.vocablist.id, sect, true);
  },

  /**
   * @method remove
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Enables and disables the form's inputs
   * @param {Boolean} [enabled] whether to enable editing
   */
  toggleInputs: function(enabled) {
    this.$('#create-list-btn').prop('disabled', !enabled).text(enabled ? 'Create list' : 'Creating list');
    this.$('#description').prop('disabled', !enabled);
    this.$('#name').prop('disabled', !enabled);
  },

  /**
   * Validates whether the list has valid attributes. If not, sets
   * an appropriate error message value (but does not display it).
   * @return {boolean} whether the list's attributes are valid
   */
  validateListAttrs: function() {
    if (!this.vocablist.get('name')) {
      this.errorMessage = 'Your list still needs a name.';
      return false;
    }

    return true;
  }
});
