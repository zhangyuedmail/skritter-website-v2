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

    this._eventsDelayed = false;
  },

  /**
   * @param {Object} [options] options for the component on how it should be rendered
   * @param {Boolean} [options.delayEvents] whether to delay responding to
   *                                        events for a short duration after rendering
   * @method render
   * @returns {StudyPromptToolbarGradingComponent}
   */
  render: function(options) {
    options = options || {};

    this.renderTemplate();

    if (options.delayEvents) {
      this._delayEvents();
    }

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
    if (this._eventsDelayed) {
      return;
    }

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
  },

  /**
   * Delays component acknowledging any events within a specified duration.
   * Used to prevent wonky event propagation.
   * @method _delayEvents
   * @private
   */
  _delayEvents: function() {
    this._eventsDelayed = true;

    setTimeout(() => {
      this._eventsDelayed = false;
    }, 100);
  }

});

module.exports = StudyPromptToolbarGradingComponent;
