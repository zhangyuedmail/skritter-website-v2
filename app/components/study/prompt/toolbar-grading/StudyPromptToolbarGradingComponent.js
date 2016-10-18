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
    'mouseup button': 'handleMouseupButton',
    'mousemove .draggable': 'handleMousemoveButton'
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

    this._lastButtonMouseoverGrade = null;
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

    this.$('button').addClass('draggable');
  },

  /**
   *
   * @param event
   */
  handleMousemoveButton: function(event) {
    let grade = $(event.currentTarget).data('value');

    if (grade !== this._lastButtonMouseoverGrade !== this._lastButtonMouseoverGrade) {
      this._lastButtonMouseoverGrade = grade;
      this.select(grade);
      this.trigger('mousemove', this.value);
    }
  },

  /**
   * @method handleMousedownButton
   * @param {Event} event
   */
  handleMouseupButton: function(event) {
    this.$('button').removeClass('draggable');
    this._lastButtonMouseoverGrade = null;

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
    this.$('button').removeClass('selected');
    this.$('.grade' + this.value).addClass('selected');

    return this;
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
