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
    'click .sentence-writing': 'handleClickValue'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocabSentence.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    options = options || {};

    this.prompt = options.prompt;
    this.vocab = options.vocab || null;

    if (this.prompt) {
      this.listenTo(this.prompt, 'reviews:set', this.fetchAndShowSentence);
    }
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
   * @param [reviews]
   * @param {VocabModel} [vocab] the VocabModel to fetch a sentence for
   */
  fetchAndShowSentence: function(reviews, vocab) {
    if (this.prompt && !this.prompt.reviews && !this.vocab && !vocab) {
      return;
    }

    this.toggleFetchingSpinner(true);

    vocab = vocab || this.prompt.reviews.vocab;

    this.vocab = vocab;

    if (!vocab.sentenceFetched) {
      vocab.sentenceFetched = true;

      vocab.fetchSentence().then((s) => {
        vocab.collection.sentences.add(s);
        this.render();
      });
    } else {
      this.render();
    }
  },

  /**
   * Gets the sentence for the current vocab
   * @return {SentenceModel} the sentence for the vocab
   */
  getSentence: function() {
    const vocab = this.getVocab() || {};
    const sentence = vocab.getSentence ? vocab.getSentence() : null;

    return sentence;
  },

  /**
   * Gets the view's vocab model
   * @return {VocabModel}
   */
  getVocab: function() {
    return this.prompt && this.prompt.reviews ? this.prompt.reviews.vocab : this.vocab;
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

  /**
   * Shows or hides the the component's content and a loading spinner
   * @param {Boolean} [show] whether to show the spinner and hide the content
   */
  toggleFetchingSpinner: function(show) {
    this.$('.fa-spinner').toggleClass('hidden', !show);
  }

});

module.exports = VocabSentenceComponent;
