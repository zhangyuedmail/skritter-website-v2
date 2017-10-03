const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabStyleComponent
 * @extends {GelatoComponent}
 */
const StudyPromptVocabStyleComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptVocabStyleComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function (options) {
    this.prompt = options.prompt;
  },

  /**
   * @method render
   * @returns {StudyPromptVocabStyleComponent}
   */
  render: function () {
    this.renderTemplate();
    return this;
  },

});

module.exports = StudyPromptVocabStyleComponent;
