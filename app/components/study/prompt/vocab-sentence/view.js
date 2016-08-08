var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabSentence
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
  },
  /**
   * @property events
   * @type Object
   */
  events: {
    'click .show-sentence': 'handleClickShowSentence',
    'click .value': 'handleClickValue'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {StudyPromptVocabSentence}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },
  /**
   * @method handleClickShowSentence
   * @param {Event} event
   */
  handleClickShowSentence: function(event) {
    event.preventDefault();

    this.stopListening();
    this.listenTo(this.prompt.reviews.vocab, 'state', this.render);
    this.prompt.reviews.vocab.fetch({
      data: {
        include_sentences: true
      },
      merge: true
    });
  },
  /**
   * @method handleClickValue
   * @param {Event} event
   */
  handleClickValue: function(event) {
    event.preventDefault();
    if (this.$('.hint').hasClass('open')) {
      this.$('.hint').removeClass('open');
      this.$('.hint').hide('slide', {direction: 'up'}, '500');
    } else {
      this.$('.hint').addClass('open');
      this.$('.hint').show('slide', {direction: 'up'}, '500');
    }
  }
});
