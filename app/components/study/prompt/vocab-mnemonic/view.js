var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabMnemonic
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
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
  template: require('./template'),
  /**
   * @method render
   * @returns {StudyPromptVocabMnemonic}
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
    return {text: this.$('textarea').val()}
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
