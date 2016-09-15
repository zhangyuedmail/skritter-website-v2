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
    this.renderTemplate();
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
