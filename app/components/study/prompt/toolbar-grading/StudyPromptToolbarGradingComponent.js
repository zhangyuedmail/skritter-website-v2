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
    'mousemove .draggable': 'handleMousemoveButton',
    'touchstart button': 'handleMousedownButton',
    'touchend button': 'handleMouseupButton',
    'touchmove .draggable': 'handleMousemoveButton',
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

    this.renderTemplate(options);

    this.update();
    if (options.delayEvents) {
      this._delayEvents();
    }

    return this;
  },

  update(selectVal, delayEvents) {
    const hideGradingBtns = !this.prompt.review || !this.prompt.review.isComplete() || app.user.get('disableGradingColor');
    this.$('gelato-component').toggleClass('hidden', hideGradingBtns);
    this.$('.tap-to-advance-wrapper').toggleClass('hidden', !((this.prompt.review && this.prompt.review.get('showTeaching')) || this.prompt.showTapToAdvanceText));
    this.$('.grading-btn-wrapper').toggleClass('hidden', (this.prompt.review && this.prompt.review.get('showTeaching')) || !this.prompt.showGradingButtons);

    // highlight correct grade
    this.$('.grading-btn').removeClass('selected');
    this.$('.grading-btn.grade' + this.value).addClass('selected');

    if (selectVal) {
      this.select(selectVal);
    }

    if (delayEvents) {
      this._delayEvents();
    }
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
   * @param {jQuery.Event} event
   */
  handleMousedownButton: function(event) {
    event.preventDefault();
    this.select($(event.currentTarget).data('value'));
    this.trigger('mousedown', this.value);

    this.$('button').addClass('draggable');
  },

  /**
   * Updates the score when the user's selection has moved to
   * a different value.
   * @param {jQuery.Event} event
   * @method handleMousemoveButton
   */
  handleMousemoveButton: function(event) {
    let el = event.type !== 'touchmove' ? event.currentTarget : this._getElementFromTouchEvent(event);
    let grade = $(el).data('value');


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

    let el = event.type !== 'touchend' ? event.currentTarget : this._getElementFromTouchEvent(event);

    event.preventDefault();
    event.stopPropagation();

    this.select($(el).data('value'));
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

    this.trigger('grade:selected', this.value);

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
  },

  /**
   * Who came up with the spec for touch events? Seriously?
   * @param {TouchEvent} event the event to get the actual target for because
   *                           currentTarget doesn't update correctly with touch events.
   * @returns {HTMLElement}
   * @private
   */
  _getElementFromTouchEvent: function(event) {
    if (event.originalEvent) {
      event = event.originalEvent;
    }

    if (event.changedTouches.length) {
      event = event.changedTouches[0];
    }

    let el = document.elementFromPoint(event.clientX, event.clientY);
    if (!$(el).data('value')) {
      el = el.parentElement;
    }

    return el;
  },

});

module.exports = StudyPromptToolbarGradingComponent;
