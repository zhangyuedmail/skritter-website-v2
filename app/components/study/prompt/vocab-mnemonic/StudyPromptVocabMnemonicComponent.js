const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabMnemonicComponent
 * @extends {GelatoComponent}
 */
const StudyPromptVocabMnemonicComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #show-mnemonic': 'handleClickShowMnemonic'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptVocabMnemonicComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.editing = false;
    this.prompt = options.prompt;
  },

  /**
   * @method render
   * @returns {StudyPromptVocabMnemonicComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method getValue
   * @returns {Object}
   */
  getValue: function() {
    return {
      creator: app.user.id,
      public: false,
      text: this.$('textarea').val()
    };
  },

  /**
   * @method handleClickShowMnemonic
   * @param {Event} event
   */
  handleClickShowMnemonic: function(event) {
    event.preventDefault();
    this.prompt.review.set('showMnemonic', true);
    this.render();
  }

});

module.exports = StudyPromptVocabMnemonicComponent;
