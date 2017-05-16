const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabWritingComponent
 * @extends {GelatoComponent}
 */
const StudyPromptVocabWritingComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptVocabWritingComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.visible = false;
  },

  /**
   * @method render
   * @returns {StudyPromptVocabWritingComponent}
   */
  render: function() {
    if (this.prompt.reviews) {
      if (app.isMobile() && _.includes(['defn', 'rdng'], this.prompt.reviews.part)) {
      } else {
        this.visible = true;
      }
    } else {
      this.visible = false;
    }

    this.renderTemplate();

    return this;
  }

});

module.exports = StudyPromptVocabWritingComponent;
