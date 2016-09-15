const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptToolbarGradingComponent
 * @extends {GelatoComponent}
 */
const StudyPromptToolbarGradingComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'mousedown button': 'handleMousedownButton',
    'mouseup button': 'handleMouseupButton'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptToolbarGradingComponent.jade'),

  /**
   * @property value
   * @type {Number}
   */
  value: null,

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
   * @returns {StudyPromptToolbarGradingComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method deselect
   * @returns {StudyPromptToolbarGradingComponent}
   */
  deselect: function() {
    this.value = null;
    return this.render();
  },

  /**
   * @method handleMousedownButton
   * @param {Event} event
   */
  handleMousedownButton: function(event) {
    event.preventDefault();
    this.select($(event.currentTarget).data('value'));
    this.trigger('mousedown', this.value);
  },

  /**
   * @method handleMousedownButton
   * @param {Event} event
   */
  handleMouseupButton: function(event) {
    event.preventDefault();
    this.select($(event.currentTarget).data('value'));
    this.trigger('mouseup', this.value);
  },

  /**
   * @method select
   * @param {Number} value
   * @returns {StudyPromptToolbarGradingComponent}
   */
  select: function(value) {
    this.value = parseInt(value, 10);
    return this.render();
  }

});

module.exports = StudyPromptToolbarGradingComponent;
