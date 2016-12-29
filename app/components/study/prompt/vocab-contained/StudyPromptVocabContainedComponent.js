const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabContainedComponent
 * @extends {GelatoComponent}
 */
const StudyPromptVocabContainedComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #show-contained': 'handleClickShowContained'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptVocabContainedComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
  },

  /**
   * @method render
   * @returns {StudyPromptVocabContainedComponent}
   */
  render: function() {
    const prompt = this.prompt;
    const reviews = prompt.reviews;
    const vocabs = reviews ? reviews.vocab.getContained(true) : [];
    const hasContained = reviews &&
      ((_.includes(['rune', 'tone'], reviews.part) && vocabs.length > 0) ||
      vocabs.length === 1);
    const vocab = vocabs[reviews && reviews.position || 0];

    this.renderTemplate({
      prompt,
      reviews,
      vocabs,
      vocab,
      hasContained
    });

    return this;
  },

  /**
   * @method handleClickShowContained
   * @param {Event} event
   */
  handleClickShowContained: function(event) {
    event.preventDefault();
    if (_.includes(['rune', 'tone'], this.prompt.reviews.part)) {
      this.prompt.review.showContained = true;
    } else {
      this.prompt.review.set('showContained', true);
    }
    this.render();
  }

});

module.exports = StudyPromptVocabContainedComponent;
