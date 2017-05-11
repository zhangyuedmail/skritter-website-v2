const GelatoComponent = require('gelato/component');

/**
 * A component that displays a vocab's sentence with its definition and reading
 * to the user.
 * @class
 * @extends {GelatoComponent}
 */
const VocabSentenceComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click .value': 'handleClickValue'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocabSentenceComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.listenTo(this.prompt, 'reviews:set', this.fetchAndShowSentence);
  },

  /**
   * @method render
   * @returns {VocabSentenceComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method fetchAndShowSentence
   * @param {ReviewCollection} [reviews]
   */
  fetchAndShowSentence: function(reviews) {
    if (!this.prompt.reviews) {
      return;
    }

    this.toggleFetchingSpinner(true);

    const vocab = this.prompt.reviews.vocab;
    vocab.sentenceFetched = true;
    vocab.fetchSentence().then((s) => {
      vocab.collection.sentences.add(s);
      this.render();
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
  },

  toggleFetchingSpinner: function(show) {
    this.$('.fa-spinner').toggleClass('hidden', !show);
  }

});

module.exports = VocabSentenceComponent;
