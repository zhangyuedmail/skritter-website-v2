const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptTutorialComponent
 * @extends {GelatoComponent}
 */
const StudyPromptTutorialComponent = GelatoComponent.extend({

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
  template: require('./StudyPromptTutorialComponent.jade'),

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
   * @returns {StudyPromptTutorialComponent}
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
  },

});

module.exports = StudyPromptTutorialComponent;
