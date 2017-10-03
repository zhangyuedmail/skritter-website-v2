let GelatoComponent = require('gelato/component');

/**
 * @class AddVocabContent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(options) {
    this.dialog = options.dialog;
  },

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-publish': 'handleClickButtonPublish',
    'click #is-textbook': 'handleClickIsTextbook',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {AddVocabContent}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method getFormData
   * @returns {Object}
   */
  getFormData: function() {
    return {
      isTextbook: this.$('#is-textbook').prop('checked'),
    };
  },

  /**
   * @method handleClickButtonAdd
   * @param {Event} event
   */
  handleClickButtonPublish: function(event) {
    event.preventDefault();
    let formData = this.getFormData();

    this.dialog.trigger('publish', formData);
    this.$('#form').addClass('hidden');
    this.$('#button-publish').addClass('hidden');
    this.$('#working').removeClass('hidden');
  },

  /**
   * @method handleClickButtonSearch
   * @param {Event} event
   */
  handleClickIsTextbook: function(event) {
    this.$('#textbook-info').toggleClass('hidden');
  },
});
