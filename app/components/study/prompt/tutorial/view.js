var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptTutorial
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
   * @property message
   * @type {String}
   */
  message: null,
  /**
   * @property events
   * @type Object
   */
  events: {},
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {StudyPromptTutorial}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },
  /**
   * @method setMessage
   * @param {String} value
   */
  setMessage: function(value) {
    this.message = value;
    this.render();
  }
});
