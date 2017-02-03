const GelatoComponent = require('gelato/component');
const vent = require('vent');

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
    'click #show-contained': 'handleClickShowContained',
    'click .child-writing': 'handleClickChildWriting',
    'click .decomp-writing': 'handleClickChildWriting'
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
    const contained = reviews ? reviews.vocab.getContained(true) : [];
    const hasContained = reviews &&
      ((_.includes(['rune', 'tone'], reviews.part) && contained.length > 0) ||
      contained.length === 1);
    const vocab = contained[reviews && reviews.position || 0];

    this.renderTemplate({
      prompt,
      reviews,
      contained,
      vocab,
      hasContained
    });

    return this;
  },

  handleClickChildWriting: function(event) {
    const id = $(event.target).data('vocabid');
    vent.trigger('studyPromptVocabInfo:show', id);
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
