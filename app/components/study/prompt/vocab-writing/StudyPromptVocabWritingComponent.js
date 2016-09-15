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
  },

  /**
   * @method render
   * @returns {StudyPromptVocabWritingComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  }

});

module.exports = StudyPromptVocabWritingComponent;
